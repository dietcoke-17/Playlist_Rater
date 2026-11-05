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
import axios from 'axios';
import qs from 'qs';
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
import { createState, verifyState } from '../lib/oauth-state';
import * as functions from 'firebase-functions';

export const authRouter = Router();

const cfg = functions.config();
const FRONTEND_URL: string =
  process.env.FRONTEND_URL ??
  cfg.app?.frontend_url ??
  'http://localhost:5173';

// ── Google OAuth config ───────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID: string =
  process.env.GOOGLE_CLIENT_ID ?? cfg.google?.client_id ?? '';
const GOOGLE_CLIENT_SECRET: string =
  process.env.GOOGLE_CLIENT_SECRET ?? cfg.google?.client_secret ?? '';
const GOOGLE_REDIRECT_URI: string =
  process.env.GOOGLE_REDIRECT_URI ?? cfg.google?.redirect_uri ?? '';
const GOOGLE_SCOPES = 'openid email profile';

// ── GET /auth/spotify ─────────────────────────────────────────────────────────
authRouter.get('/spotify', (_req: Request, res: Response) => {
  const state = createState();
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

      if (!code || !state || !verifyState(state)) {
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

      // Issue Playlitfy JWT – sub is the Playlitfy users.id (UUID)
      const jwt = signToken({
        sub: user.id,
        spotifyId: spotifyProfile.id,
        email: spotifyProfile.email,
        displayName: spotifyProfile.display_name,
        avatarUrl: avatarUrl ?? '',
        authProvider: 'spotify',
      });

      return res.redirect(`${FRONTEND_URL}/login?token=${jwt}`);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /auth/google ──────────────────────────────────────────────────────────
authRouter.get('/google', (_req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return res.redirect(`${FRONTEND_URL}/login?error=google_not_configured`);
  }
  const state = createState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    scope: GOOGLE_SCOPES,
    state,
    access_type: 'online',
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// ── GET /auth/google/callback ─────────────────────────────────────────────────
interface GoogleUserInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

authRouter.get(
  '/google/callback',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state, error } = req.query as Record<string, string>;

      if (error) {
        return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
      }
      if (!code || !state || !verifyState(state)) {
        return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
      }

      // Exchange code for tokens
      const { data: tokens } = await axios.post(
        'https://oauth2.googleapis.com/token',
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: GOOGLE_REDIRECT_URI,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      // Fetch Google profile
      const { data: gUser } = await axios.get<GoogleUserInfo>(
        'https://openidconnect.googleapis.com/v1/userinfo',
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      );

      // Link to an existing account by email, or create a new one
      let user: { id: string } | null = null;

      if (gUser.email) {
        const { data: byEmail } = await supabase
          .from('users')
          .select('id, google_id, display_name')
          .eq('email', gUser.email)
          .maybeSingle();
        if (byEmail && !byEmail.google_id) {
          await supabase
            .from('users')
            .update({
              google_id: gUser.sub,
              display_name: gUser.name ?? byEmail.display_name,
              avatar_url: gUser.picture ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', byEmail.id);
          user = { id: byEmail.id };
        } else if (byEmail?.google_id === gUser.sub) {
          user = { id: byEmail.id };
        }
      }

      if (!user) {
        const { data: created, error: insertErr } = await supabase
          .from('users')
          .upsert(
            {
              google_id: gUser.sub,
              email: gUser.email ?? null,
              display_name: gUser.name ?? gUser.email ?? 'Google User',
              avatar_url: gUser.picture ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'google_id', ignoreDuplicates: false }
          )
          .select('id')
          .single();
        if (insertErr) throw insertErr;
        user = created;
      }

      // Store Google platform token
      await supabase.from('platform_tokens').upsert(
        {
          user_id: user!.id,
          platform: 'google',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token ?? null,
          token_expires_at: new Date(
            Date.now() + (tokens.expires_in ?? 3600) * 1000
          ).toISOString(),
          platform_user_id: gUser.sub,
          metadata: { email: gUser.email ?? null },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,platform' }
      );

      const jwt = signToken({
        sub: user!.id,
        email: gUser.email,
        displayName: gUser.name ?? '',
        avatarUrl: gUser.picture ?? '',
        authProvider: 'google',
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

      // Nullify stored Spotify tokens (sub is users.id; spotifyId kept for
      // backwards compatibility with tokens issued before the migration)
      const spotifyId = payload.spotifyId ?? payload.sub;
      await supabase
        .from('users')
        .update({
          spotify_access_token: null,
          spotify_refresh_token: null,
        })
        .or(`id.eq.${payload.sub},spotify_id.eq.${spotifyId}`);

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

      // sub is users.id for new tokens; fall back to spotify_id for
      // tokens issued before the UUID migration
      let { data: user, error } = await supabase
        .from('users')
        .select(
          'id, spotify_id, google_id, email, display_name, avatar_url, is_curator_public, bio, genres, followers_count, playlists_count, created_at'
        )
        .eq('id', payload.sub)
        .maybeSingle();

      if (!user && payload.spotifyId) {
        const fallback = await supabase
          .from('users')
          .select(
            'id, spotify_id, google_id, email, display_name, avatar_url, is_curator_public, bio, genres, followers_count, playlists_count, created_at'
          )
          .eq('spotify_id', payload.spotifyId)
          .maybeSingle();
        user = fallback.data;
        error = fallback.error;
      }

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
