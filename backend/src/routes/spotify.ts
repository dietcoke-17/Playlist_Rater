/**
 * Spotify public data routes.
 *
 * GET  /api/v1/spotify/playlist?url=<spotify_url>
 *   Fetch a public Spotify playlist by URL or ID using client-credentials.
 *   Returns normalised playlist + tracks.
 *
 * GET  /api/v1/spotify/search?q=<query>&type=track|playlist&limit=10
 *   Full-text search across Spotify's catalog.
 */

import { Router, Request, Response, NextFunction } from 'express';
import {
  fetchPlaylist,
  fetchUserPublicPlaylists,
  extractPlaylistId,
  formatDuration,
  getClientToken,
  type SpotifyPlaylist,
} from '../lib/spotify';
import { buildConversionLinks } from '../lib/converter';
import axios from 'axios';

export const spotifyRouter = Router();

// ── GET /spotify/playlist ─────────────────────────────────────────────────────
spotifyRouter.get(
  '/playlist',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url } = req.query as { url?: string };

      if (!url) {
        return res
          .status(400)
          .json({ error: 'url query parameter is required' });
      }

      let playlistId: string;
      try {
        playlistId = extractPlaylistId(url);
      } catch {
        return res.status(400).json({ error: 'Invalid Spotify playlist URL' });
      }

      const raw = await fetchPlaylist(playlistId);
      const normalised = normalisePlaylist(raw);

      return res.json({ playlist: normalised });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return res.status(404).json({ error: 'Playlist not found or private' });
      }
      next(err);
    }
  }
);

// ── GET /spotify/user/:spotifyUserId/playlists ────────────────────────────────
spotifyRouter.get(
  '/user/:spotifyUserId/playlists',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const spotifyUserId = req.params.spotifyUserId as string;
      const playlists = await fetchUserPublicPlaylists(spotifyUserId);
      return res.json({
        playlists: playlists.map((p) => normalisePlaylist(p)),
        total: playlists.length,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /spotify/search ───────────────────────────────────────────────────────
spotifyRouter.get(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, type = 'track', limit = '10' } = req.query as Record<
        string,
        string
      >;

      if (!q) {
        return res.status(400).json({ error: 'q query parameter is required' });
      }

      const validTypes = ['track', 'playlist', 'artist', 'album'];
      const safeType = validTypes.includes(type) ? type : 'track';
      const safeLimit = Math.min(parseInt(limit, 10) || 10, 50);

      const token = await getClientToken();
      const { data } = await axios.get(
        'https://api.spotify.com/v1/search',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { q, type: safeType, limit: safeLimit },
        }
      );

      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

// ── Normalise helper ──────────────────────────────────────────────────────────
export function normalisePlaylist(raw: SpotifyPlaylist) {
  const tracks = raw.tracks.items
    .filter((i) => i.track !== null)
    .map((i, idx) => {
      const t = i.track!;
      return {
        id: t.id,
        position: idx + 1,
        title: t.name,
        artist: t.artists.map((a) => a.name).join(', '),
        album: t.album.name,
        duration: formatDuration(t.duration_ms),
        durationMs: t.duration_ms,
        coverImage: t.album.images[0]?.url ?? null,
        isrc: t.external_ids?.isrc ?? null,
        previewUrl: t.preview_url,
        spotifyUrl: t.external_urls.spotify,
        popularity: t.popularity,
      };
    });

  const firstTrack = tracks[0];
  const conversionLinks = firstTrack
    ? buildConversionLinks(raw.name, { title: firstTrack.title, artist: firstTrack.artist, isrc: firstTrack.isrc ?? undefined })
    : [];

  const totalMs = tracks.reduce((sum, t) => sum + t.durationMs, 0);

  return {
    id: raw.id,
    title: raw.name,
    description: raw.description,
    isPublic: raw.public,
    followers: raw.followers.total,
    coverImage: raw.images[0]?.url ?? null,
    trackCount: raw.tracks.total,
    tracks,
    duration: formatDuration(totalMs),
    curator: {
      spotifyId: raw.owner.id,
      displayName: raw.owner.display_name,
      spotifyUrl: raw.owner.external_urls.spotify,
    },
    spotifyUrl: raw.external_urls.spotify,
    conversionLinks,
  };
}
