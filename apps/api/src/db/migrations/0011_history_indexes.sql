-- Add isPR flag to exercise_sets
ALTER TABLE "exercise_sets" ADD COLUMN IF NOT EXISTS "is_pr" boolean NOT NULL DEFAULT false;

-- Indexes for history list query performance
CREATE INDEX IF NOT EXISTS "ws_user_started_idx" ON "workout_sessions" ("user_id", "started_at");
CREATE INDEX IF NOT EXISTS "ws_user_template_idx" ON "workout_sessions" ("user_id", "workout_template_id");

-- Indexes for session exercise lookups
CREATE INDEX IF NOT EXISTS "se_session_idx" ON "session_exercises" ("workout_session_id");
CREATE INDEX IF NOT EXISTS "se_exercise_idx" ON "session_exercises" ("exercise_id");

-- Indexes for exercise set queries (PR lookups)
CREATE INDEX IF NOT EXISTS "es_session_exercise_idx" ON "exercise_sets" ("session_exercise_id");
CREATE INDEX IF NOT EXISTS "es_is_pr_idx" ON "exercise_sets" ("session_exercise_id", "is_pr");
