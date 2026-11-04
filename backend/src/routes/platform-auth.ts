/**
 * Platform auth routes – Multi-platform OAuth 2.0 flows.
 *
 * GET  /api/v1/auth/apple        → Redirect to Apple Music
 * GET  /api/v1/auth/apple/callback  → Handle Apple callback
 * GET  /api/v1/auth/youtube      → Redirect to YouTube Music
 * GET  /api/v1/auth/youtube/callback → Handle YouTube callback
 * GET  /api/v1/auth/tidal        → Redirect to TIDAL
 * GET  /api/v1/auth/tidal/callback → Handle TIDAL callback
 * GET  /api/v1/auth/amazon       → Redirect to Amazon Music
 * GET  /api/v1/auth/amazon/callback → Handle Amazon callback
 * GET  /api/v1/auth/platforms    → List connected platforms
 * DELETE /api/v1/auth/platforms/:platform → Disconnect platform
 * POST /api/v1/auth/sync/:platform → Manually trigger sync
 */

import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import {
  exchangeAppleCode,
  refreshAppleToken,
  APPLE_MUSIC_REDIRECT_URI,
} from '../lib/apple-music';
import {
  exchangeYoutubeCode,
  refreshYoutubeToken,
  YOUTUBE_REDIRECT_URI,
} from '../lib/youtube-music';
import {
  exchangeTidalCode,
  refreshTidalToken,
  TIDAL_REDIRECT_URI,
} from '../lib/tidal';
import {
  exchangeAmazonCode,
  refreshAmazonToken,
  AMAZON_REDIRECT_URI,
} from '../lib/amazon-music';
import { signToken, verifyToken } from '../lib/jwt';
import { supabase } from '../lib/supabase';
import * as functions from 'firebase-functions';

export const platformAuthRouter = Router();

const cfg = functions.config();
const FRONTEND_URL: string =
  process.env.FRONTEND_URL ??
  cfg.app?.frontend_url ??
  'http://localhost:5173';

// ── State store (in-memory; in prod use Supabase or Redis) ───────────────────
const oauthStates = new Map<string, number>();

function generateState(): string {
  const state = crypto.randomBytes(16).toString('hex');
  oauthStates.set(state, Date.now() + 10 * 60 * 1000);
  return state;
}

function validateState(state: string): boolean {
  const exp = oauthStates.get(state);
  if (!exp || exp < Date.now()) return false;
  oauthStates.delete(state);
  return true;
}

// ── Apple Music OAuth ────────────────────────────────────────────────────────
platformAuthRouter.get('/apple', (_req: Request, res: Response) => {
  const state = generateState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.APPLE_MUSIC_KEY_ID || '',
    redirect_uri: APPLE_MUSIC_REDIRECT_URI,
    scope: 'music-user-library-read',
    state,
    response_mode: 'form_post',
  });
  res.redirect(`https://appleid.apple.com/auth/authorize?${params.toString()}`);
});

platformAuthRouter.post('/apple/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, id_token } = req.body;

    if (!code || !state || !validateState(state)) {
      return res.status(400).json({ error: 'Invalid state or code' });
    }

    const tokens = await exchangeAppleCode(code);

    // Get user info from id_token (Apple provides it)
    // For now, we'll create a placeholder user
    const userId = crypto.randomUUID();

    // Store platform token
    await supabase.from('platform_tokens').upsert({
      user_id: userId,
      platform: 'apple',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    });

    // Issue Playlitfy JWT
    const jwt = signToken({
      sub: userId,
      platform: 'apple',
    });

    return res.json({ token: jwt });
  } catch (err) {
    next(err);
  }
});

// ── YouTube Music OAuth ─────────────────────────────────────────────────────
platformAuthRouter.get('/youtube', (_req: Request, res: Response) => {
  const state = generateState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.YOUTUBE_CLIENT_ID || '',
    redirect_uri: YOUTUBE_REDIRECT_URI,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

platformAuthRouter.get('/youtube/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) {
      return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    }

    if (!code || !state || !validateState(state)) {
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    const tokens = await exchangeYoutubeCode(code);

    // Get user info from YouTube API
    // For now, we'll create a placeholder user
    const userId = crypto.randomUUID();

    // Store platform token
    await supabase.from('platform_tokens').upsert({
      user_id: userId,
      platform: 'youtube',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    });

    // Issue Playlitfy JWT
    const jwt = signToken({
      sub: userId,
      platform: 'youtube',
    });

    return res.redirect(`${FRONTEND_URL}/login?token=${jwt}`);
  } catch (err) {
    next(err);
  }
});

// ── TIDAL OAuth ───────────────────────────────────────────────────────────────
platformAuthRouter.get('/tidal', (_req: Request, res: Response) => {
  const state = generateState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TIDAL_CLIENT_ID || '',
    redirect_uri: TIDAL_REDIRECT_URI,
    scope: '',
    state,
  });
  res.redirect(`https://login.tidal.com/authorize?${params.toString()}`);
});

platformAuthRouter.get('/tidal/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) {
      return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    }

    if (!code || !state || !validateState(state)) {
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    const tokens = await exchangeTidalCode(code);

    // For now, we'll create a placeholder user
    const userId = crypto.randomUUID();

    // Store platform token
    await supabase.from('platform_tokens').upsert({
      user_id: userId,
      platform: 'tidal',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    });

    // Issue Playlitfy JWT
    const jwt = signToken({
      sub: userId,
      platform: 'tidal',
    });

    return res.redirect(`${FRONTEND_URL}/login?token=${jwt}`);
  } catch (err) {
    next(err);
  }
});

// ── Amazon Music OAuth ────────────────────────────────────────────────────────
platformAuthRouter.get('/amazon', (_req: Request, res: Response) => {
  const state = generateState();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.AMAZON_CLIENT_ID || '',
    redirect_uri: AMAZON_REDIRECT_URI,
    scope: 'music:catalog',
    state,
  });
  res.redirect(`https://www.amazon.com/ap/oa?${params.toString()}`);
});

platformAuthRouter.get('/amazon/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) {
      return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    }

    if (!code || !state || !validateState(state)) {
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    const tokens = await exchangeAmazonCode(code);

    // For now, we'll create a placeholder user
    const userId = crypto.randomUUID();

    // Store platform token
    await supabase.from('platform_tokens').upsert({
      user_id: userId,
      platform: 'amazon',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    });

    // Issue Playlitfy JWT
    const jwt = signToken({
      sub: userId,
      platform: 'amazon',
    });

    return res.redirect(`${FRONTEND_URL}/login?token=${jwt}`);
  } catch (err) {
    next(err);
  }
});

// ── List Connected Platforms ───────────────────────────────────────────────────
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

// ── Manually Trigger Sync ───────────────────────────────────────────────────────
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
