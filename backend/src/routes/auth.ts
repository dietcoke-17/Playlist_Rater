/**
 * Auth routes – Spotify OAuth 2.0 flow.
 *
 * GET  /api/v1/auth/spotify    → Redirect user to Spotify authorisation page
 * GET  /api/v1/auth/callback   → Handle Spotify callback, issue Playlitfy JWT
 * POST /api/v1/auth/refresh    → Refresh a Spotify access token
 * POST /api/v1/auth/logout     → Invalidate server-side session (Supabase)
 * GET  /api/v1/auth/me         → Return current user from JWT
 *
 * After successful OAuth the user is redirected to the frontend with the JWT
 * as a query param: <FRONTEND_URL>/login?token=<jwt>
 *
 * The callback also:
 *   1. Upserts the user record in Supabase `users` table.
 *   2. Silently fetches their public playlists.
 *   3. Auto-features playlists that exceed the popularity threshold.
 */

import { Router, Request, Response, NextFunction } from 'express';
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES,
  exchangeCodeForTokens,
  fetchUserProfile,
  fetchUserPublicPlaylists,
  fetchPlaylist,
  isPopularPlaylist,
  formatDuration,
  refreshAccessToken,
} from '../lib/spotify';
import { signToken, verifyToken } from '../lib/jwt';
import { supabase } from '../lib/supabase';
import * as functions from 'firebase-functions';
import crypto from 'crypto';

export const authRouter = Router();

const cfg = functions.config();
const FRONTEND_URL: string =
  process.env.FRONTEND_URL ??
  cfg.app?.frontend_url ??
  'http://localhost:5173';

// ── State store (in-memory; in prod use Supabase or Redis) ───────────────────
const oauthStates = new Map<string, number>(); // state → expiry ms

function generateState(): string {
  const state = crypto.randomBytes(16).toString('hex');
  oauthStates.set(state, Date.now() + 10 * 60 * 1000); // 10 min TTL
  return state;
}

function validateState(state: string): boolean {
  const exp = oauthStates.get(state);
  if (!exp || exp < Date.now()) return false;
  oauthStates.delete(state);
  return true;
}

// ── GET /auth/spotify ─────────────────────────────────────────────────────────
authRouter.get('/spotify', (_req: Request, res: Response) => {
  const state = generateState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
    show_dialog: 'false',
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// ── GET /auth/callback ────────────────────────────────────────────────────────
authRouter.get(
  '/callback',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state, error } = req.query as Record<string, string>;

      if (error) {
        return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
      }

      if (!code || !state || !validateState(state)) {
        return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
      }

      // Exchange code for tokens
      const tokens = await exchangeCodeForTokens(code);

      // Fetch Spotify profile
      const spotifyProfile = await fetchUserProfile(tokens.access_token);

      // Upsert user in Supabase
      const avatarUrl =
        spotifyProfile.images[0]?.url ?? null;

      const { data: user, error: dbErr } = await supabase
        .from('users')
        .upsert(
          {
            spotify_id: spotifyProfile.id,
            email: spotifyProfile.email,
            display_name: spotifyProfile.display_name,
            avatar_url: avatarUrl,
            spotify_access_token: tokens.access_token,
            spotify_refresh_token: tokens.refresh_token,
            spotify_token_expires_at: new Date(
              Date.now() + tokens.expires_in * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'spotify_id', ignoreDuplicates: false }
        )
        .select()
        .single();

      if (dbErr) throw dbErr;

      // Background job: silently fetch & auto-feature popular public playlists
      void autoFeaturePublicPlaylists(
        spotifyProfile.id,
        tokens.access_token,
        user.id,
        user.is_curator_public ?? false
      ).catch((e) =>
        console.error('[autoFeature] Failed for', spotifyProfile.id, e)
      );

      // Issue Playlitfy JWT
      const jwt = signToken({
        sub: spotifyProfile.id,
        spotifyId: spotifyProfile.id,
        email: spotifyProfile.email,
        displayName: spotifyProfile.display_name,
        avatarUrl: avatarUrl ?? '',
      });

      return res.redirect(`${FRONTEND_URL}/login?token=${jwt}`);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /auth/refresh ────────────────────────────────────────────────────────
authRouter.post(
  '/refresh',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refresh_token } = req.body as { refresh_token?: string };
      if (!refresh_token) {
        return res.status(400).json({ error: 'refresh_token is required' });
      }

      const tokens = await refreshAccessToken(refresh_token);

      // Update stored token in Supabase
      // We need the spotify_id from the stored refresh token
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_refresh_token', refresh_token)
        .single();

      if (userData) {
        await supabase
          .from('users')
          .update({
            spotify_access_token: tokens.access_token,
            spotify_token_expires_at: new Date(
              Date.now() + tokens.expires_in * 1000
            ).toISOString(),
            // refresh_token may rotate
            ...(tokens.refresh_token
              ? { spotify_refresh_token: tokens.refresh_token }
              : {}),
          })
          .eq('id', userData.id);
      }

      return res.json({
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
        ...(tokens.refresh_token
          ? { refresh_token: tokens.refresh_token }
          : {}),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /auth/logout ─────────────────────────────────────────────────────────
authRouter.post(
  '/logout',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.slice(7);
      let payload;
      try {
        payload = verifyToken(token);
      } catch {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Nullify stored Spotify tokens
      await supabase
        .from('users')
        .update({
          spotify_access_token: null,
          spotify_refresh_token: null,
        })
        .eq('spotify_id', payload.spotifyId);

      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /auth/me ──────────────────────────────────────────────────────────────
authRouter.get(
  '/me',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.slice(7);
      let payload;
      try {
        payload = verifyToken(token);
      } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select(
          'id, spotify_id, email, display_name, avatar_url, is_curator_public, bio, genres, followers_count, playlists_count, created_at'
        )
        .eq('spotify_id', payload.spotifyId)
        .single();

      if (error || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

// ── Background: auto-feature popular public playlists ────────────────────────
async function autoFeaturePublicPlaylists(
  spotifyUserId: string,
  accessToken: string,
  dbUserId: string,
  isCuratorPublic: boolean
): Promise<void> {
  const publicPlaylists = await fetchUserPublicPlaylists(
    spotifyUserId,
    accessToken
  );

  for (const pMeta of publicPlaylists) {
    // Only fetch full details for potentially popular playlists (saves API quota)
    // Check follower count in the listing response (items have a simplified version)
    // Spotify simplified playlist objects don't include followers.total,
    // so we fetch selectively for playlists that look promising (high track count as proxy).
    if ((pMeta.tracks?.total ?? 0) < 5) continue;

    let fullPlaylist;
    try {
      fullPlaylist = await fetchPlaylist(pMeta.id, accessToken);
    } catch {
      continue; // private or unavailable
    }

    const popular = isPopularPlaylist(fullPlaylist);

    // Auto-feature if popular OR if curator explicitly opted-in
    const shouldFeature = popular || isCuratorPublic;
    if (!shouldFeature) continue;

    const coverImage =
      fullPlaylist.images[0]?.url ?? null;

    const tracks = fullPlaylist.tracks.items
      .filter((i) => i.track !== null)
      .map((i) => {
        const t = i.track!;
        return {
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

    // Upsert playlist record
    const { data: pl } = await supabase
      .from('playlists')
      .upsert(
        {
          spotify_playlist_id: fullPlaylist.id,
          user_id: dbUserId,
          title: fullPlaylist.name,
          description: fullPlaylist.description,
          cover_image: coverImage,
          track_count: fullPlaylist.tracks.total,
          followers_count: fullPlaylist.followers.total,
          source_service: 'Spotify',
          spotify_url: fullPlaylist.external_urls.spotify,
          is_public: fullPlaylist.public,
          is_featured: popular,          // auto-featured due to popularity
          is_curator_approved: isCuratorPublic, // curator explicitly opted-in
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'spotify_playlist_id', ignoreDuplicates: false }
      )
      .select('id')
      .single();

    if (!pl) continue;

    // Upsert track records
    if (tracks.length > 0) {
      await supabase.from('playlist_tracks').upsert(
        tracks.map((t, idx) => ({ ...t, playlist_id: pl.id, position: idx + 1 })),
        { onConflict: 'playlist_id,position', ignoreDuplicates: false }
      );
    }
  }
}
