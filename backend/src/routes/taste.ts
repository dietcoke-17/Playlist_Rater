/**
 * Taste API routes.
 *
 * GET  /api/v1/taste/profile - Get user's taste profile
 * POST /api/v1/taste/analyze - Trigger taste analysis
 * GET  /api/v1/taste/recommendations - Get taste-based recommendations
 */

import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import { verifyToken } from '../lib/jwt';
import { generateTasteInsights, recommendPlaylistsByMood } from '../lib/ai-service';

export const tasteRouter = Router();

// ── Get User's Taste Profile ───────────────────────────────────────────────────
tasteRouter.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
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

    const { data: profile, error } = await supabase
      .from('user_taste_profile')
      .select('*')
      .eq('user_id', payload.sub)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Taste profile not found' });
    }

    return res.json({ profile });
  } catch (err) {
    next(err);
  }
});

// ── Trigger Taste Analysis ─────────────────────────────────────────────────────
tasteRouter.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
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

    // Get user's listening history
    const { data: history, error } = await supabase
      .from('listening_history')
      .select('playlist_id, platform, played_at')
      .eq('user_id', payload.sub)
      .order('played_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch listening history' });
    }

    if (!history || history.length === 0) {
      return res.status(400).json({ error: 'No listening history found' });
    }

    // Get playlist details
    const playlistIds = [...new Set(history.map((h) => h.playlist_id).filter(Boolean))];
    const { data: playlists } = await supabase
      .from('playlists')
      .select('id, title, genre')
      .in('id', playlistIds);

    const playlistMap = new Map(playlists?.map((p) => [p.id, p]) || []);

    const enrichedHistory = history
      .map((h) => {
        const playlist = playlistMap.get(h.playlist_id);
        return {
          playlist_title: playlist?.title || 'Unknown',
          genre: playlist?.genre,
          platform: h.platform,
          played_at: h.played_at,
        };
      });

    // Generate taste insights
    const insights = await generateTasteInsights(enrichedHistory);

    // Update taste profile
    const { data: existingProfile } = await supabase
      .from('user_taste_profile')
      .select('id')
      .eq('user_id', payload.sub)
      .single();

    const profileData = {
      user_id: payload.sub,
      favorite_genres: insights.favorite_genres,
      favorite_artists: insights.favorite_artists,
      preferred_moods: insights.preferred_moods,
      listening_patterns: {
        pattern: insights.listening_pattern,
        total_sessions: history.length,
      },
      last_analyzed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingProfile) {
      await supabase
        .from('user_taste_profile')
        .update(profileData)
        .eq('id', existingProfile.id);
    } else {
      await supabase.from('user_taste_profile').insert(profileData);
    }

    return res.json({
      success: true,
      profile: profileData,
    });
  } catch (err) {
    next(err);
  }
});

// ── Get Taste-Based Recommendations ───────────────────────────────────────────
tasteRouter.get('/recommendations', async (req: Request, res: Response, next: NextFunction) => {
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

    // Get user's taste profile
    const { data: profile } = await supabase
      .from('user_taste_profile')
      .select('*')
      .eq('user_id', payload.sub)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'Taste profile not found. Run analyze first.' });
    }

    // Get user's preferred mood
    const preferredMood = profile.preferred_moods?.[0] || 'chill';

    // Generate recommendations
    const recommendation = await recommendPlaylistsByMood(preferredMood, {
      favorite_genres: profile.favorite_genres,
      preferred_moods: profile.preferred_moods,
    });

    // For now, return playlists by mood (actual playlist matching would be implemented separately)
    const { data: moodPlaylists } = await supabase
      .from('playlist_moods')
      .select('playlist_id, confidence_score, playlists(*)')
      .eq('mood_id', preferredMood)
      .order('confidence_score', { ascending: false })
      .limit(20);

    const playlists = moodPlaylists?.map((pm) => ({
      ...pm.playlists,
      mood_confidence: pm.confidence_score,
    }));

    return res.json({
      playlists,
      reasoning: recommendation.reasoning,
    });
  } catch (err) {
    next(err);
  }
});
