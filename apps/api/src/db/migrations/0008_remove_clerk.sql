-- Migration: rename clerk_id → auth_id
-- This removes the Clerk dependency from the schema.
-- The auth_id column stores the external auth provider user ID
-- (Apple sub, Google sub, or dev user ID).

ALTER TABLE "users" RENAME COLUMN "clerk_id" TO "auth_id";
