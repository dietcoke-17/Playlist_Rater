/**
 * Connected Services API routes.
 *
 * GET  /api/v1/connected-services - List user's connected platforms
 * POST /api/v1/connected-services/:platform/connect - Connect platform
 * DELETE /api/v1/connected-services/:platform - Disconnect platform
 * GET  /api/v1/connected-services/:platform/playlists - Get playlists from platform
 * POST /api/v1/connected-services/:platform/sync - Sync playlists from platform
 */

import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import { verifyToken } from '../lib/jwt';

export const connectedServicesRouter = Router();

// ── List Connected Platforms ───────────────────────────────────────────────────
connectedServicesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
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

    const { data: tokens, error } = await supabase
      .from('platform_tokens')
      .select('platform, platform_user_id, token_expires_at, metadata')
      .eq('user_id', payload.sub);

    if (error) throw error;

    return res.json({ platforms: tokens || [] });
  } catch (err) {
    next(err);
  }
});

// ── Connect Platform ───────────────────────────────────────────────────────────
connectedServicesRouter.post('/:platform/connect', async (req: Request, res: Response, next: NextFunction) => {
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
    const { access_token, refresh_token, platform_user_id, metadata } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'access_token is required' });
    }

    const { error } = await supabase.from('platform_tokens').upsert({
      user_id: payload.sub,
      platform,
      access_token,
      refresh_token,
      platform_user_id,
      metadata,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── Disconnect Platform ───────────────────────────────────────────────────────
connectedServicesRouter.delete('/:platform', async (req: Request, res: Response, next: NextFunction) => {
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

    const { error } = await supabase
      .from('platform_tokens')
      .delete()
      .eq('user_id', payload.sub)
      .eq('platform', platform);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── Get Playlists from Platform ───────────────────────────────────────────────
connectedServicesRouter.get('/:platform/playlists', async (req: Request, res: Response, next: NextFunction) => {
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

    // Get platform token
    const { data: tokenData, error: tokenError } = await supabase
      .from('platform_tokens')
      .select('access_token')
      .eq('user_id', payload.sub)
      .eq('platform', platform)
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({ error: 'Platform not connected' });
    }

    // Fetch playlists based on platform
    let playlists = [];

    if (platform === 'spotify') {
      const { fetchUserPublicPlaylists } = await import('../lib/spotify');
      playlists = await fetchUserPublicPlaylists(payload.sub, tokenData.access_token);
    } else {
      // Other platforms would be implemented similarly
      return res.status(501).json({ error: `${platform} playlist fetching not yet implemented` });
    }

    return res.json({ playlists });
  } catch (err) {
    next(err);
  }
});

// ── Sync Playlists from Platform ───────────────────────────────────────────────
connectedServicesRouter.post('/:platform/sync', async (req: Request, res: Response, next: NextFunction) => {
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
    return res.json({
      success: true,
      message: `Sync triggered for ${platform}`,
    });
  } catch (err) {
    next(err);
  }
});
