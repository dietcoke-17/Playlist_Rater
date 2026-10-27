/**
 * Curator directory routes.
 *
 * GET  /api/v1/curators               – paginated public curator list
 * GET  /api/v1/curators/:id           – single curator profile + playlists
 * POST /api/v1/curators/opt-in        – curator opts-in to public directory (auth required)
 * POST /api/v1/curators/opt-out       – curator opts-out  (auth required)
 * PUT  /api/v1/curators/profile       – update bio / genres (auth required)
 *
 * "Opt-in" means:
 *   - is_curator_public = true in `users` table
 *   - All their approved playlists become visible in the /curators directory
 *   - Future playlist syncs will auto-feature their playlists
 */

import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/requireAuth';

export const curatorRouter = Router();

// ── GET /curators ─────────────────────────────────────────────────────────────
curatorRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        genre,
        search,
        page = '1',
        limit = '24',
        sort = 'rating',
      } = req.query as Record<string, string>;

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
      const offset = (pageNum - 1) * limitNum;

      let query = supabase
        .from('users')
        .select(
          `
          id,
          spotify_id,
          display_name,
          avatar_url,
          bio,
          genres,
          is_curator_public,
          followers_count,
          playlists_count,
          avg_rating,
          created_at,
          playlists!inner (
            id,
            title,
            cover_image,
            track_count,
            followers_count,
            avg_rating,
            genre,
            spotify_url,
            is_featured,
            is_curator_approved
          )
        `,
          { count: 'exact' }
        )
        .eq('is_curator_public', true)
        .eq('playlists.is_curator_approved', true);

      // Genre filter
      if (genre && genre !== 'All') {
        query = query.contains('genres', [genre]);
      }

      // Search filter (display_name or bio)
      if (search) {
        query = query.or(
          `display_name.ilike.%${search}%,bio.ilike.%${search}%`
        );
      }

      // Sorting
      const sortMap: Record<string, { col: string; asc: boolean }> = {
        rating: { col: 'avg_rating', asc: false },
        followers: { col: 'followers_count', asc: false },
        name: { col: 'display_name', asc: true },
        newest: { col: 'created_at', asc: false },
      };
      const sortCfg = sortMap[sort] ?? sortMap.rating;
      query = query
        .order(sortCfg.col, { ascending: sortCfg.asc })
        .range(offset, offset + limitNum - 1);

      const { data, count, error } = await query;

      if (error) throw error;

      return res.json({
        curators: data ?? [],
        total: count ?? 0,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil((count ?? 0) / limitNum),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /curators/:id ─────────────────────────────────────────────────────────
curatorRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const { data: curator, error } = await supabase
        .from('users')
        .select(
          `
          id,
          spotify_id,
          display_name,
          avatar_url,
          bio,
          genres,
          is_curator_public,
          followers_count,
          playlists_count,
          avg_rating,
          created_at,
          playlists (
            id,
            title,
            description,
            cover_image,
            track_count,
            followers_count,
            avg_rating,
            genre,
            source_service,
            spotify_url,
            is_featured,
            is_curator_approved,
            created_at
          )
        `
        )
        .eq('id', id)
        .eq('is_curator_public', true)
        .single();

      if (error || !curator) {
        return res.status(404).json({ error: 'Curator not found or not public' });
      }

      return res.json({ curator });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /curators/opt-in (auth required) ─────────────────────────────────────
curatorRouter.post(
  '/opt-in',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub; // Spotify ID, set by requireAuth

      const { data: user, error: findErr } = await supabase
        .from('users')
        .select('id, is_curator_public')
        .eq('spotify_id', userId)
        .single();

      if (findErr || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.is_curator_public) {
        return res.json({ message: 'Already opted in as a public curator' });
      }

      // Mark user as public curator
      const { error: updateErr } = await supabase
        .from('users')
        .update({
          is_curator_public: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateErr) throw updateErr;

      // Make all their approved playlists visible
      await supabase
        .from('playlists')
        .update({ is_curator_approved: true })
        .eq('user_id', user.id);

      return res.json({
        success: true,
        message:
          'You are now a public curator on Playlitfy. Your playlists are visible in the community directory.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /curators/opt-out (auth required) ────────────────────────────────────
curatorRouter.post(
  '/opt-out',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub;

      const { data: user, error: findErr } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_id', userId)
        .single();

      if (findErr || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await supabase
        .from('users')
        .update({ is_curator_public: false, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      // Hide all their playlists from the public directory
      await supabase
        .from('playlists')
        .update({ is_curator_approved: false })
        .eq('user_id', user.id);

      return res.json({
        success: true,
        message: 'You have been removed from the public curator directory.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /curators/profile (auth required) ─────────────────────────────────────
curatorRouter.put(
  '/profile',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub;

      const { bio, genres } = req.body as {
        bio?: string;
        genres?: string[];
      };

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (typeof bio === 'string') updates.bio = bio.slice(0, 500);
      if (Array.isArray(genres)) updates.genres = genres.slice(0, 10);

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('spotify_id', userId);

      if (error) throw error;

      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);
