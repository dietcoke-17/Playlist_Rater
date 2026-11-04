-- ============================================================
--  Playlitfy – Supabase PostgreSQL Schema
--  Run this in the Supabase SQL Editor to initialise the DB.
-- ============================================================

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spotify_id                TEXT UNIQUE NOT NULL,
  email                     TEXT,
  display_name              TEXT NOT NULL,
  avatar_url                TEXT,
  bio                       TEXT,
  genres                    TEXT[]        DEFAULT '{}',
  is_curator_public         BOOLEAN       DEFAULT FALSE,
  followers_count           INTEGER       DEFAULT 0,
  playlists_count           INTEGER       DEFAULT 0,
  avg_rating                NUMERIC(3,1)  DEFAULT 0,
  spotify_access_token      TEXT,
  spotify_refresh_token     TEXT,
  spotify_token_expires_at  TIMESTAMPTZ,
  created_at                TIMESTAMPTZ   DEFAULT NOW(),
  updated_at                TIMESTAMPTZ   DEFAULT NOW()
);

-- ── playlists ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.playlists (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  spotify_playlist_id   TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL,
  description           TEXT,
  cover_image           TEXT,
  track_count           INTEGER       DEFAULT 0,
  duration              TEXT,
  followers_count       INTEGER       DEFAULT 0,
  source_service        TEXT          DEFAULT 'Spotify',
  spotify_url           TEXT,
  genre                 TEXT,
  is_public             BOOLEAN       DEFAULT TRUE,
  is_curator_approved   BOOLEAN       DEFAULT FALSE,
  is_featured           BOOLEAN       DEFAULT FALSE,
  avg_rating            NUMERIC(3,1)  DEFAULT 0,
  review_count          INTEGER       DEFAULT 0,
  created_at            TIMESTAMPTZ   DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playlists_curator_approved ON public.playlists(is_curator_approved, avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_featured ON public.playlists(is_featured, followers_count DESC);

-- ── playlist_tracks ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id       UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  position          INTEGER NOT NULL,
  spotify_track_id  TEXT,
  title             TEXT NOT NULL,
  artist            TEXT NOT NULL,
  album             TEXT,
  duration          TEXT,
  cover_image       TEXT,
  isrc              TEXT,
  preview_url       TEXT,
  UNIQUE (playlist_id, position)
);

CREATE INDEX IF NOT EXISTS idx_tracks_playlist ON public.playlist_tracks(playlist_id, position);

-- ── ratings ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ratings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id  UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  score        INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  voter_key    TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (playlist_id, voter_key)
);

CREATE INDEX IF NOT EXISTS idx_ratings_playlist ON public.ratings(playlist_id);

-- ── Trigger: keep users.playlists_count in sync ───────────────────────────────
CREATE OR REPLACE FUNCTION sync_user_playlist_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET playlists_count = (
    SELECT COUNT(*) FROM public.playlists
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
      AND is_curator_approved = TRUE
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_playlist_count ON public.playlists;
CREATE TRIGGER trg_sync_playlist_count
  AFTER INSERT OR UPDATE OR DELETE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION sync_user_playlist_count();

-- ── Trigger: keep users.avg_rating in sync ───────────────────────────────────
CREATE OR REPLACE FUNCTION sync_user_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users u
  SET avg_rating = (
    SELECT COALESCE(ROUND(AVG(p.avg_rating)::NUMERIC, 1), 0)
    FROM public.playlists p
    WHERE p.user_id = u.id AND p.is_curator_approved = TRUE AND p.review_count > 0
  ),
  updated_at = NOW()
  WHERE u.id = (
    SELECT user_id FROM public.playlists WHERE id = COALESCE(NEW.id, OLD.id)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_user_avg_rating ON public.playlists;
CREATE TRIGGER trg_sync_user_avg_rating
  AFTER UPDATE OF avg_rating ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION sync_user_avg_rating();

-- ── Row-Level Security ────────────────────────────────────────────────────────
-- ── platform_tokens ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.platform_tokens (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform              TEXT NOT NULL,
  access_token          TEXT NOT NULL,
  refresh_token         TEXT,
  token_expires_at      TIMESTAMPTZ,
  platform_user_id      TEXT,
  metadata              JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_platform_tokens_user ON public.platform_tokens(user_id);

-- ── mood_tags ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mood_tags (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT UNIQUE NOT NULL,
  emoji                 TEXT,
  description           TEXT,
  color_hex             TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.mood_tags (name, emoji, description, color_hex) VALUES
('chill', '😌', 'Relaxed, laid-back', '#4ADE80'),
('energetic', '⚡', 'High energy, upbeat', '#F59E0B'),
('focus', '🎯', 'Concentration, work', '#3B82F6'),
('romantic', '💕', 'Love, intimacy', '#EC4899'),
('sad', '😢', 'Melancholic, emotional', '#6366F1'),
('happy', '😊', 'Uplifting, joyful', '#FCD34D'),
('workout', '💪', 'Exercise, high intensity', '#EF4444'),
('sleep', '😴', 'Calm, ambient', '#8B5CF6'),
('party', '🎉', 'Dance, celebration', '#10B981'),
('nostalgic', '📻', 'Retro, classic', '#F97316')
ON CONFLICT (name) DO NOTHING;

-- ── playlist_moods ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.playlist_moods (
  playlist_id           UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  mood_id               UUID NOT NULL REFERENCES public.mood_tags(id) ON DELETE CASCADE,
  confidence_score     NUMERIC(3,2),
  PRIMARY KEY (playlist_id, mood_id)
);

CREATE INDEX IF NOT EXISTS idx_playlist_moods_mood ON public.playlist_moods(mood_id);

-- ── user_taste_profile ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_taste_profile (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  favorite_genres       TEXT[] DEFAULT '{}',
  favorite_artists      TEXT[] DEFAULT '{}',
  preferred_moods       UUID[] REFERENCES public.mood_tags(id),
  avg_tempo_range      TEXT,
  listening_patterns   JSONB,
  last_analyzed_at     TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── listening_history ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.listening_history (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  playlist_id           UUID REFERENCES public.playlists(id) ON DELETE SET NULL,
  platform              TEXT NOT NULL,
  played_at             TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds      INTEGER,
  completed             BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listening_history_user ON public.listening_history(user_id, played_at DESC);

-- ── curator_rankings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.curator_rankings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quality_score         NUMERIC(3,2),
  engagement_score      NUMERIC(3,2),
  consistency_score     NUMERIC(3,2),
  total_score           NUMERIC(3,2),
  follower_tier        TEXT,
  specialty_genres      TEXT[],
  last_calculated_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── Update existing tables ─────────────────────────────────────────────────────

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS preferred_platform TEXT;

ALTER TABLE public.playlists
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'spotify',
ADD COLUMN IF NOT EXISTS original_url TEXT,
ADD COLUMN IF NOT EXISTS audio_features JSONB,
ADD COLUMN IF NOT EXISTS is_top_tier BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_playlists_platform ON public.playlists(platform, is_curator_approved);

ALTER TABLE public.playlist_tracks
ADD COLUMN IF NOT EXISTS audio_features JSONB,
ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- ── Row-Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_taste_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curator_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read playlists" ON public.playlists
  FOR SELECT USING (is_curator_approved = TRUE);

CREATE POLICY "Public read tracks" ON public.playlist_tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id AND p.is_curator_approved = TRUE
    )
  );

CREATE POLICY "Public read curators" ON public.users
  FOR SELECT USING (is_curator_public = TRUE);

CREATE POLICY "Public insert ratings" ON public.ratings
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public read ratings" ON public.ratings
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read moods" ON public.mood_tags
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read playlist moods" ON public.playlist_moods
  FOR SELECT USING (TRUE);

CREATE POLICY "User own platform tokens" ON public.platform_tokens
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "User own taste profile" ON public.user_taste_profile
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "User own listening history" ON public.listening_history
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Public read curator rankings" ON public.curator_rankings
  FOR SELECT USING (TRUE);
