/**
 * Ratings routes – community 1-10 scores for playlists.
 *
 * GET  /api/v1/ratings/:playlistId     – get score distribution for a playlist
 * POST /api/v1/ratings/:playlistId     – submit a vote (public, rate-limited by IP)
 * GET  /api/v1/ratings/leaderboard     – top-rated playlists globally
 *
 * Votes are stored in Supabase `ratings` table.
 * After each vote the playlist's `avg_rating` and `review_count` are updated
 * via a Supabase database trigger (see schema.sql) or inline here.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const ratingsRouter = Router();

// ── GET /ratings/leaderboard ──────────────────────────────────────────────────
ratingsRouter.get(
  '/leaderboard',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = '50', genre } = req.query as Record<string, string>;
      const safeLimit = Math.min(100, parseInt(limit, 10) || 50);

      let query = supabase
        .from('playlists')
        .select(
          `
          id,
          title,
          cover_image,
          track_count,
          avg_rating,
          review_count,
          genre,
          source_service,
          spotify_url,
          followers_count,
          is_featured,
          users!inner ( display_name, avatar_url, spotify_id )
        `
        )
        .eq('is_curator_approved', true)
        .order('avg_rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(safeLimit);

      if (genre && genre !== 'All') {
        query = query.eq('genre', genre);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.json({ playlists: data ?? [] });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /ratings/:playlistId ──────────────────────────────────────────────────
ratingsRouter.get(
  '/:playlistId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { playlistId } = req.params;

      const { data: playlist, error: plErr } = await supabase
        .from('playlists')
        .select('id, avg_rating, review_count')
        .eq('id', playlistId)
        .single();

      if (plErr || !playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }

      // Score distribution (1–10 count)
      const { data: dist, error: distErr } = await supabase
        .from('ratings')
        .select('score')
        .eq('playlist_id', playlistId);

      if (distErr) throw distErr;

      const distribution = Array.from({ length: 10 }, (_, i) => i + 1).map(
        (score) => ({
          score,
          count: (dist ?? []).filter((r) => r.score === score).length,
        })
      );

      return res.json({
        playlistId,
        avgRating: playlist.avg_rating,
        reviewCount: playlist.review_count,
        distribution,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /ratings/:playlistId ─────────────────────────────────────────────────
ratingsRouter.post(
  '/:playlistId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { playlistId } = req.params;
      const { score, voterFingerprint } = req.body as {
        score?: number;
        voterFingerprint?: string;
      };

      // Validate score
      if (!score || !Number.isInteger(score) || score < 1 || score > 10) {
        return res
          .status(400)
          .json({ error: 'score must be an integer between 1 and 10' });
      }

      // Use IP + optional fingerprint to deduplicate (one vote per client per playlist)
      const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ??
        req.socket.remoteAddress ??
        'unknown';
      const voterKey = voterFingerprint ?? ip;

      // Check for existing vote
      const { data: existing } = await supabase
        .from('ratings')
        .select('id, score')
        .eq('playlist_id', playlistId)
        .eq('voter_key', voterKey)
        .maybeSingle();

      if (existing) {
        // Allow updating the score (user can change their mind)
        await supabase
          .from('ratings')
          .update({ score, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        // Insert new rating
        const { error: insErr } = await supabase.from('ratings').insert({
          playlist_id: playlistId,
          score,
          voter_key: voterKey,
        });
        if (insErr) throw insErr;
      }

      // Recompute aggregate (or let DB trigger handle this)
      const { data: all } = await supabase
        .from('ratings')
        .select('score')
        .eq('playlist_id', playlistId);

      const scores = (all ?? []).map((r) => r.score);
      const avgRating =
        scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 0;

      await supabase
        .from('playlists')
        .update({ avg_rating: avgRating, review_count: scores.length })
        .eq('id', playlistId);

      return res.json({
        success: true,
        avgRating,
        reviewCount: scores.length,
        yourScore: score,
        updated: !!existing,
      });
    } catch (err) {
      next(err);
    }
  }
);
