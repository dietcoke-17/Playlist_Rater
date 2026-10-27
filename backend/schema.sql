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
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

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
