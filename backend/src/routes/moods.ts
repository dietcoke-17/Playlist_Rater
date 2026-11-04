/**
 * Moods API routes.
 *
 * GET  /api/v1/moods - List all moods
 * GET  /api/v1/moods/:id/playlists - Get playlists for a mood
 * POST /api/v1/moods/playlist/:id/detect - Detect mood for playlist
 */

import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import { detectMoodFromPlaylist } from '../lib/ai-service';

export const moodsRouter = Router();

// ── List All Moods ───────────────────────────────────────────────────────────
moodsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: moods, error } = await supabase
      .from('mood_tags')
      .select('*')
      .order('name');

    if (error) throw error;

    return res.json({ moods });
  } catch (err) {
    next(err);
  }
});

// ── Get Playlists for a Mood ───────────────────────────────────────────────────
moodsRouter.get('/:id/playlists', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data: playlistMoods, error } = await supabase
      .from('playlist_moods')
      .select('playlist_id, confidence_score, playlists(*)')
      .eq('mood_id', id)
      .order('confidence_score', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;

    const playlists = playlistMoods?.map((pm) => ({
      ...pm.playlists,
      mood_confidence: pm.confidence_score,
    }));

    return res.json({ playlists });
  } catch (err) {
    next(err);
  }
});

// ── Detect Mood for Playlist ───────────────────────────────────────────────────
moodsRouter.post('/playlist/:id/detect', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get playlist details
    const { data: playlist, error } = await supabase
      .from('playlists')
      .select('id, title, description, genre')
      .eq('id', id)
      .single();

    if (error || !playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Detect moods using AI
    const detection = await detectMoodFromPlaylist(playlist);

    // Get mood tags
    const { data: moodTags } = await supabase
      .from('mood_tags')
      .select('id, name');

    if (!moodTags) {
      return res.status(500).json({ error: 'Failed to fetch mood tags' });
    }

    const moodMap = new Map(moodTags.map((m) => [m.name, m.id]));

    // Upsert mood associations
    for (const mood of detection.moods) {
      const moodId = moodMap.get(mood.name);
      if (moodId) {
        await supabase.from('playlist_moods').upsert({
          playlist_id: id,
          mood_id: moodId,
          confidence_score: mood.confidence,
        });
      }
    }

    return res.json({
      success: true,
      moods: detection.moods,
    });
  } catch (err) {
    next(err);
  }
});
