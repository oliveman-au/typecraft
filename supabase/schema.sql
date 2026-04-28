-- =============================================================
-- TypeCraft Database Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- =============================================================

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT        NOT NULL,
  display_name  TEXT        NOT NULL,
  date_of_birth DATE        NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- 2. TEST RESULTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.test_results (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mode             TEXT        NOT NULL CHECK (mode IN ('infinite', 'sixty')),
  wpm              INTEGER     NOT NULL CHECK (wpm >= 0),
  accuracy         INTEGER     NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  words_typed      INTEGER     NOT NULL CHECK (words_typed >= 0),
  duration_seconds INTEGER     NOT NULL CHECK (duration_seconds > 0),
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "results_select_all"  ON public.test_results FOR SELECT USING (true);
CREATE POLICY "results_insert_own"  ON public.test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_results_user_id   ON public.test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_mode      ON public.test_results(mode);
CREATE INDEX IF NOT EXISTS idx_results_wpm_desc  ON public.test_results(wpm DESC);
CREATE INDEX IF NOT EXISTS idx_results_created   ON public.test_results(created_at DESC);

-- =============================================
-- 3. LEADERBOARD VIEWS
-- Best WPM per user (one row per user), sorted globally by WPM desc
-- =============================================

-- 60-second test leaderboard
CREATE OR REPLACE VIEW public.leaderboard_sixty AS
SELECT
  best.id,
  best.user_id,
  p.display_name,
  best.wpm,
  best.accuracy,
  best.words_typed,
  best.created_at
FROM (
  SELECT DISTINCT ON (tr.user_id)
    tr.id,
    tr.user_id,
    tr.wpm,
    tr.accuracy,
    tr.words_typed,
    tr.created_at
  FROM public.test_results tr
  WHERE tr.mode = 'sixty'
  ORDER BY tr.user_id, tr.wpm DESC, tr.accuracy DESC
) best
JOIN public.profiles p ON p.id = best.user_id
ORDER BY best.wpm DESC, best.accuracy DESC;

-- Infinite mode leaderboard (minimum 50 words to qualify)
CREATE OR REPLACE VIEW public.leaderboard_infinite AS
SELECT
  best.id,
  best.user_id,
  p.display_name,
  best.wpm,
  best.accuracy,
  best.words_typed,
  best.created_at
FROM (
  SELECT DISTINCT ON (tr.user_id)
    tr.id,
    tr.user_id,
    tr.wpm,
    tr.accuracy,
    tr.words_typed,
    tr.created_at
  FROM public.test_results tr
  WHERE tr.mode = 'infinite'
    AND tr.words_typed >= 50
  ORDER BY tr.user_id, tr.wpm DESC, tr.accuracy DESC
) best
JOIN public.profiles p ON p.id = best.user_id
ORDER BY best.wpm DESC, best.accuracy DESC;

-- Grant read access to leaderboard views
GRANT SELECT ON public.leaderboard_sixty    TO anon, authenticated;
GRANT SELECT ON public.leaderboard_infinite TO anon, authenticated;

-- =============================================
-- 4. UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================
-- DONE! Your TypeCraft database is ready.
-- Next steps:
--   1. Go to Supabase → Authentication → Providers → Enable Google
--   2. Copy your Project URL and anon key into .env.local
--   3. Run: npm run dev
-- =============================================================
