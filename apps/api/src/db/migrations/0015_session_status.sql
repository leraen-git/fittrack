CREATE TYPE session_status_enum AS ENUM ('IN_PROGRESS', 'DONE', 'ABANDONED');

ALTER TABLE workout_sessions
  ADD COLUMN status session_status_enum NOT NULL DEFAULT 'IN_PROGRESS';

-- Backfill existing data
UPDATE workout_sessions SET status = 'DONE' WHERE completed_at IS NOT NULL;
UPDATE workout_sessions SET status = 'ABANDONED'
  WHERE completed_at IS NULL
    AND started_at < now() - interval '24 hours';
