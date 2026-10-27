/**
 * Playlist management routes (auth required).
 *
 * GET  /api/v1/playlists              – list the authenticated user's playlists
 * GET  /api/v1/playlists/:id          – single playlist with full tracklist
 * POST /api/v1/playlists              – submit / publish a playlist to the directory
 * PUT  /api/v1/playlists/:id          – update metadata (genre, description)
 * DELETE /api/v1/playlists/:id        – remove from the public directory
 * POST /api/v1/playlists/:id/sync     – re-sync from Spotify
 */

import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import {
  fetchPlaylist,
  fetchUserPublicPlaylists,
  formatDuration,
  refreshAccessToken,
} from '../lib/spotify';

export const playlistRouter = Router();

// Helper: get the stored Spotify tokens for the requesting user
async function getStoredSpotifyToken(spotifyId: string): Promise<string> {
  const { data, error } = await supabase
    .from('users')
    .select(
      'spotify_access_token, spotify_refresh_token, spotify_token_expires_at, id'
    )
    .eq('spotify_id', spotifyId)
    .single();

  if (error || !data) throw new Error('User not found in database');

  // Token still valid?
  const expiresAt = new Date(data.spotify_token_expires_at).getTime();
  if (expiresAt > Date.now() + 30_000) {
    return data.spotify_access_token as string;
  }

  // Refresh
  const tokens = await refreshAccessToken(data.spotify_refresh_token as string);
  await supabase
    .from('users')
    .update({
      spotify_access_token: tokens.access_token,
      spotify_token_expires_at: new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString(),
      ...(tokens.refresh_token
        ? { spotify_refresh_token: tokens.refresh_token }
        : {}),
    })
    .eq('id', data.id);

  return tokens.access_token;
}

// ── GET /playlists ────────────────────────────────────────────────────────────
playlistRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const spotifyId = req.user!.sub;

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_id', spotifyId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { data, error } = await supabase
        .from('playlists')
        .select(
          'id, title, description, cover_image, track_count, avg_rating, review_count, genre, source_service, spotify_url, is_curator_approved, is_featured, created_at, updated_at'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ playlists: data ?? [] });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /playlists/:id ────────────────────────────────────────────────────────
playlistRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const spotifyId = req.user!.sub;

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_id', spotifyId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { data: playlist, error } = await supabase
        .from('playlists')
        .select(
          `
          *,
          playlist_tracks ( * )
        `
        )
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }

      return res.json({ playlist });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /playlists – Publish a playlist ──────────────────────────────────────
playlistRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const spotifyId = req.user!.sub;

      const {
        spotifyPlaylistUrl,
        genre,
        description,
        allowPublic = false,
      } = req.body as {
        spotifyPlaylistUrl?: string;
        genre?: string;
        description?: string;
        allowPublic?: boolean;
      };

      if (!spotifyPlaylistUrl) {
        return res
          .status(400)
          .json({ error: 'spotifyPlaylistUrl is required' });
      }

      // Get user from DB
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('id, is_curator_public')
        .eq('spotify_id', spotifyId)
        .single();

      if (userErr || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch fresh Spotify data
      const accessToken = await getStoredSpotifyToken(spotifyId);

      // Extract ID
      const match = spotifyPlaylistUrl.match(
        /open\.spotify\.com\/playlist\/([a-zA-Z0-9]{22})/
      );
      if (!match) {
        return res.status(400).json({ error: 'Invalid Spotify playlist URL' });
      }
      const playlistId = match[1];

      const raw = await fetchPlaylist(playlistId, accessToken);

      const coverImage = raw.images[0]?.url ?? null;
      const tracks = raw.tracks.items
        .filter((i) => i.track !== null)
        .map((i, idx) => {
          const t = i.track!;
          return {
            position: idx + 1,
            spotify_track_id: t.id,
            title: t.name,
            artist: t.artists.map((a) => a.name).join(', '),
            album: t.album.name,
            duration: formatDuration(t.duration_ms),
            cover_image: t.album.images[0]?.url ?? null,
            isrc: t.external_ids?.isrc ?? null,
            preview_url: t.preview_url,
          };
        });

      const totalMs = raw.tracks.items.reduce(
        (sum, i) => sum + (i.track?.duration_ms ?? 0),
        0
      );

      // Upsert playlist
      const { data: playlist, error: plErr } = await supabase
        .from('playlists')
        .upsert(
          {
            user_id: user.id,
            spotify_playlist_id: raw.id,
            title: raw.name,
            description: description ?? raw.description,
            cover_image: coverImage,
            track_count: raw.tracks.total,
            duration: formatDuration(totalMs),
            followers_count: raw.followers.total,
            source_service: 'Spotify',
            spotify_url: raw.external_urls.spotify,
            genre: genre ?? null,
            is_public: raw.public,
            // A playlist is approved for the directory if:
            //   - curator explicitly opted in, OR
            //   - they submitted with allowPublic=true
            is_curator_approved: user.is_curator_public || allowPublic,
            is_featured: raw.followers.total >= 1_000,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'spotify_playlist_id', ignoreDuplicates: false }
        )
        .select('id')
        .single();

      if (plErr) throw plErr;

      // Upsert tracks
      if (tracks.length > 0) {
        await supabase.from('playlist_tracks').upsert(
          tracks.map((t) => ({ ...t, playlist_id: playlist!.id })),
          { onConflict: 'playlist_id,position', ignoreDuplicates: false }
        );
      }

      // If curator opted in, also update user's is_curator_public
      if (allowPublic && !user.is_curator_public) {
        await supabase
          .from('users')
          .update({ is_curator_public: true, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }

      return res.status(201).json({
        success: true,
        playlistId: playlist!.id,
        message: allowPublic
          ? 'Playlist published to the public curator directory.'
          : 'Playlist saved to your library.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /playlists/:id – Update metadata ──────────────────────────────────────
playlistRouter.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const spotifyId = req.user!.sub;

      const { genre, description, allowPublic } = req.body as {
        genre?: string;
        description?: string;
        allowPublic?: boolean;
      };

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_id', spotifyId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (genre !== undefined) updates.genre = genre;
      if (description !== undefined) updates.description = description;
      if (allowPublic !== undefined) updates.is_curator_approved = allowPublic;

      const { error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /playlists/:id ─────────────────────────────────────────────────────
playlistRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const spotifyId = req.user!.sub;

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_id', spotifyId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      // Soft-delete: just remove from directory, keep data for ratings history
      const { error } = await supabase
        .from('playlists')
        .update({
          is_curator_approved: false,
          is_featured: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return res.json({ success: true, message: 'Playlist removed from the public directory.' });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /playlists/:id/sync – Re-sync from Spotify ──────────────────────────
playlistRouter.post(
  '/:id/sync',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const spotifyId = req.user!.sub;

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_id', spotifyId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const { data: playlist } = await supabase
        .from('playlists')
        .select('spotify_playlist_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

      const accessToken = await getStoredSpotifyToken(spotifyId);
      const raw = await fetchPlaylist(playlist.spotify_playlist_id, accessToken);

      const tracks = raw.tracks.items
        .filter((i) => i.track !== null)
        .map((i, idx) => {
          const t = i.track!;
          return {
            position: idx + 1,
            playlist_id: id,
            spotify_track_id: t.id,
            title: t.name,
            artist: t.artists.map((a) => a.name).join(', '),
            album: t.album.name,
            duration: formatDuration(t.duration_ms),
            cover_image: t.album.images[0]?.url ?? null,
            isrc: t.external_ids?.isrc ?? null,
            preview_url: t.preview_url,
          };
        });

      // Delete old tracks and reinsert
      await supabase.from('playlist_tracks').delete().eq('playlist_id', id);
      if (tracks.length > 0) {
        await supabase.from('playlist_tracks').insert(tracks);
      }

      // Update playlist metadata
      const totalMs = raw.tracks.items.reduce(
        (sum, i) => sum + (i.track?.duration_ms ?? 0),
        0
      );
      await supabase.from('playlists').update({
        title: raw.name,
        description: raw.description,
        cover_image: raw.images[0]?.url ?? null,
        track_count: raw.tracks.total,
        duration: formatDuration(totalMs),
        followers_count: raw.followers.total,
        is_featured: raw.followers.total >= 1_000,
        updated_at: new Date().toISOString(),
      }).eq('id', id);

      return res.json({
        success: true,
        syncedTracks: tracks.length,
        message: 'Playlist synced from Spotify.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /playlists/import-library – Import all public playlists ───────────────
playlistRouter.post(
  '/import-library',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const spotifyId = req.user!.sub;

      const { data: user } = await supabase
        .from('users')
        .select('id, is_curator_public')
        .eq('spotify_id', spotifyId)
        .single();

      if (!user) return res.status(404).json({ error: 'User not found' });

      const accessToken = await getStoredSpotifyToken(spotifyId);
      const publicPlaylists = await fetchUserPublicPlaylists(
        spotifyId,
        accessToken
      );

      let imported = 0;
      for (const p of publicPlaylists) {
        const { error } = await supabase
          .from('playlists')
          .upsert(
            {
              user_id: user.id,
              spotify_playlist_id: p.id,
              title: p.name,
              description: p.description,
              cover_image: p.images[0]?.url ?? null,
              track_count: p.tracks.total,
              source_service: 'Spotify',
              spotify_url: p.external_urls.spotify,
              is_public: p.public,
              is_curator_approved: user.is_curator_public,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'spotify_playlist_id', ignoreDuplicates: true }
          );
        if (!error) imported++;
      }

      return res.json({
        success: true,
        imported,
        total: publicPlaylists.length,
        message: `${imported} playlists imported from your Spotify library.`,
      });
    } catch (err) {
      next(err);
    }
  }
);
