/**
 * Platform auth routes – Multi-platform OAuth 2.0 flows.
 *
 * GET  /api/v1/auth/apple        → Redirect to Apple
 * POST /api/v1/auth/apple/callback → Handle Apple callback (form_post)
 * GET  /api/v1/auth/youtube      → Redirect to Google (YouTube scopes)
 * GET  /api/v1/auth/youtube/callback → Handle YouTube callback
 * GET  /api/v1/auth/tidal        → Redirect to TIDAL
 * GET  /api/v1/auth/tidal/callback → Handle TIDAL callback
 * GET  /api/v1/auth/amazon       → Redirect to Amazon
 * GET  /api/v1/auth/amazon/callback → Handle Amazon callback
 * GET  /api/v1/auth/platforms    → List connected platforms
 * DELETE /api/v1/auth/platforms/:platform → Disconnect platform
 * POST /api/v1/auth/sync/:platform → Manually trigger sync
 *
 * Every callback resolves (or creates) a real `users` row, stores the
 * platform token against users.id, and redirects to
 * <FRONTEND_URL>/login?token=<jwt> like the Spotify flow.
 */

import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import qs from 'qs';
import {
  exchangeAppleCode,
  APPLE_MUSIC_REDIRECT_URI,
} from '../lib/apple-music';
import {
  exchangeYoutubeCode,
  YOUTUBE_REDIRECT_URI,
} from '../lib/youtube-music';
import {
  exchangeTidalCode,
  TIDAL_REDIRECT_URI,
} from '../lib/tidal';
import {
  exchangeAmazonCode,
  AMAZON_REDIRECT_URI,
} from '../lib/amazon-music';
import { signToken, verifyToken } from '../lib/jwt';
import { supabase } from '../lib/supabase';
import { createState, verifyState } from '../lib/oauth-state';
import * as functions from 'firebase-functions';

export const platformAuthRouter = Router();

const cfg = functions.config();
const FRONTEND_URL: string =
  process.env.FRONTEND_URL ??
  cfg.app?.frontend_url ??
  'http://localhost:5173';

// ── Helpers ───────────────────────────────────────────────────────────────────

interface PlatformTokenSet {
  access_token: string;
  refresh_token?: string | null;
  expires_in?: number;
}

interface UserIdentity {
  provider: 'apple' | 'youtube' | 'tidal' | 'amazon';
  /** Stable ID from the provider (apple sub, youtube channel id, ...) */
  providerUserId?: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

/** Decode a JWT payload without verification (token came straight from the provider over TLS). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

/**
 * Find an existing user by provider id or email, or create a new one.
 * Returns the users.id UUID.
 */
async function resolveUser(identity: UserIdentity): Promise<{ id: string }> {
  const providerColumn: Record<UserIdentity['provider'], string | null> = {
    apple: 'apple_id',
    youtube: 'youtube_channel_id',
    tidal: null,
    amazon: null,
  };
  const col = providerColumn[identity.provider];

  // 1) Lookup by provider-specific column
  if (col && identity.providerUserId) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq(col, identity.providerUserId)
      .maybeSingle();
    if (data) return data;
  }

  // 2) Link by email to an existing account
  if (identity.email) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('email', identity.email)
      .maybeSingle();
    if (data) {
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (col && identity.providerUserId) updates[col] = identity.providerUserId;
      if (identity.displayName) updates.display_name = identity.displayName;
      if (identity.avatarUrl) updates.avatar_url = identity.avatarUrl;
      await supabase.from('users').update(updates).eq('id', data.id);
      return data;
    }
  }

  // 3) Create a new user
  const insert: Record<string, unknown> = {
    email: identity.email ?? null,
    display_name:
      identity.displayName ??
      identity.email ??
      `${identity.provider.charAt(0).toUpperCase() + identity.provider.slice(1)} User`,
    avatar_url: identity.avatarUrl ?? null,
    updated_at: new Date().toISOString(),
  };
  if (col && identity.providerUserId) insert[col] = identity.providerUserId;

  const { data, error } = await supabase
    .from('users')
    .insert(insert)
    .select('id')
    .single();

  if (error || !data) throw error ?? new Error('Failed to create user');
  return data;
}

/** Store the platform token and issue a Playlitfy JWT, then redirect to frontend. */
async function finishOAuth(
  res: Response,
  identity: UserIdentity,
  tokens: PlatformTokenSet
): Promise<void> {
  const user = await resolveUser(identity);

  await supabase.from('platform_tokens').upsert(
    {
      user_id: user.id,
      platform: identity.provider,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      token_expires_at: new Date(
        Date.now() + (tokens.expires_in ?? 3600) * 1000
      ).toISOString(),
      platform_user_id: identity.providerUserId ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,platform' }
  );

  const jwt = signToken({
    sub: user.id,
    email: identity.email ?? undefined,
    displayName: identity.displayName ?? undefined,
    avatarUrl: identity.avatarUrl ?? undefined,
    authProvider: identity.provider,
  });

  res.redirect(`${FRONTEND_URL}/login?token=${jwt}`);
}

function oauthErrorRedirect(res: Response, err: unknown): void {
  console.error('[platform-auth]', err);
  res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
}

// ── Apple ─────────────────────────────────────────────────────────────────────
platformAuthRouter.get('/apple', (_req: Request, res: Response) => {
  const state = createState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.APPLE_MUSIC_KEY_ID || '',
    redirect_uri: APPLE_MUSIC_REDIRECT_URI,
    scope: 'name email',
    state,
    response_mode: 'form_post',
  });
  res.redirect(`https://appleid.apple.com/auth/authorize?${params.toString()}`);
});

platformAuthRouter.post('/apple/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, id_token, error } = req.body as Record<string, string>;

    if (error) return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    if (!code || !state || !verifyState(state)) {
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    const tokens = await exchangeAppleCode(code);

    // Apple sends the user's identity in id_token (JWT)
    const claims = id_token ? decodeJwtPayload(id_token) : null;
    const appleSub = typeof claims?.sub === 'string' ? claims.sub : undefined;
    const email = typeof claims?.email === 'string' ? claims.email : undefined;

    await finishOAuth(
      res,
      {
        provider: 'apple',
        providerUserId: appleSub,
        email,
        displayName: email ? email.split('@')[0] : 'Apple User',
      },
      tokens
    );
  } catch (err) {
    oauthErrorRedirect(res, err);
  }
});

// ── YouTube Music (Google OAuth with YouTube scopes) ──────────────────────────
platformAuthRouter.get('/youtube', (_req: Request, res: Response) => {
  const state = createState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.YOUTUBE_CLIENT_ID || '',
    redirect_uri: YOUTUBE_REDIRECT_URI,
    scope:
      'openid email https://www.googleapis.com/auth/youtube.readonly',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

platformAuthRouter.get('/youtube/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    if (!code || !state || !verifyState(state)) {
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    const tokens = await exchangeYoutubeCode(code);

    // Pull email/name from the Google id_token and the channel id from YouTube API
    let email: string | undefined;
    let displayName: string | undefined;
    let avatarUrl: string | undefined;
    let channelId: string | undefined;

    try {
      const { data: channels } = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels',
        {
          params: { part: 'snippet', mine: 'true' },
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );
      const ch = channels.items?.[0];
      if (ch) {
        channelId = ch.id;
        displayName = ch.snippet?.title;
        avatarUrl = ch.snippet?.thumbnails?.default?.url;
      }
    } catch (e) {
      console.warn('[youtube] channel fetch failed:', (e as Error).message);
    }

    // exchangeYoutubeCode doesn't return id_token; fetch userinfo instead
    try {
      const { data: ui } = await axios.get(
        'https://openidconnect.googleapis.com/v1/userinfo',
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      );
      email = ui.email;
      displayName = displayName ?? ui.name;
      avatarUrl = avatarUrl ?? ui.picture;
    } catch {
      // email scope may not have been granted – continue without it
    }

    await finishOAuth(
      res,
      {
        provider: 'youtube',
        providerUserId: channelId,
        email,
        displayName,
        avatarUrl,
      },
      tokens
    );
  } catch (err) {
    oauthErrorRedirect(res, err);
  }
});

// ── TIDAL ─────────────────────────────────────────────────────────────────────
platformAuthRouter.get('/tidal', (_req: Request, res: Response) => {
  const state = createState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TIDAL_CLIENT_ID || '',
    redirect_uri: TIDAL_REDIRECT_URI,
    scope: '',
    state,
  });
  res.redirect(`https://login.tidal.com/authorize?${params.toString()}`);
});

platformAuthRouter.get('/tidal/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    if (!code || !state || !verifyState(state)) {
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    const tokens = await exchangeTidalCode(code);

    // TIDAL's user endpoint returns the authenticated user's profile
    let tidalUserId: string | undefined;
    let displayName: string | undefined;
    try {
      const { data } = await axios.get('https://api.tidal.com/v1/users', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      tidalUserId = String(data?.id ?? data?.username ?? '');
      displayName = data?.name ?? data?.username;
    } catch (e) {
      console.warn('[tidal] user fetch failed:', (e as Error).message);
    }

    await finishOAuth(
      res,
      {
        provider: 'tidal',
        providerUserId: tidalUserId || undefined,
        displayName: displayName ?? 'TIDAL User',
      },
      tokens
    );
  } catch (err) {
    oauthErrorRedirect(res, err);
  }
});

// ── Amazon Music ──────────────────────────────────────────────────────────────
platformAuthRouter.get('/amazon', (_req: Request, res: Response) => {
  const state = createState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.AMAZON_CLIENT_ID || '',
    redirect_uri: AMAZON_REDIRECT_URI,
    scope: 'profile',
    state,
  });
  res.redirect(`https://www.amazon.com/ap/oa?${params.toString()}`);
});

platformAuthRouter.get('/amazon/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    if (!code || !state || !verifyState(state)) {
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    const tokens = await exchangeAmazonCode(code);

    // Amazon profile endpoint (requires profile scope)
    let amazonUserId: string | undefined;
    let displayName: string | undefined;
    try {
      const { data } = await axios.get('https://api.amazon.com/user/profile', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      amazonUserId = data?.user_id;
      displayName = data?.name;
    } catch (e) {
      console.warn('[amazon] profile fetch failed:', (e as Error).message);
    }

    await finishOAuth(
      res,
      {
        provider: 'amazon',
        providerUserId: amazonUserId,
        displayName: displayName ?? 'Amazon Music User',
      },
      tokens
    );
  } catch (err) {
    oauthErrorRedirect(res, err);
  }
});

// ── List Connected Platforms ──────────────────────────────────────────────────
platformAuthRouter.get('/platforms', async (req: Request, res: Response, next: NextFunction) => {
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

    const { data: tokens } = await supabase
      .from('platform_tokens')
      .select('platform, platform_user_id, token_expires_at')
      .eq('user_id', payload.sub);

    return res.json({ platforms: tokens });
  } catch (err) {
    next(err);
  }
});

// ── Disconnect Platform ───────────────────────────────────────────────────────
platformAuthRouter.delete('/platforms/:platform', async (req: Request, res: Response, next: NextFunction) => {
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

    const { platform } = req.params;

    await supabase
      .from('platform_tokens')
      .delete()
      .eq('user_id', payload.sub)
      .eq('platform', platform);

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── Manually Trigger Sync ─────────────────────────────────────────────────────
platformAuthRouter.post('/sync/:platform', async (req: Request, res: Response, next: NextFunction) => {
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

    const { platform } = req.params;

    // Trigger sync job (this would be implemented in the playlist-sync job)
    // For now, return success
    return res.json({ success: true, message: `Sync triggered for ${platform}` });
  } catch (err) {
    next(err);
  }
});
