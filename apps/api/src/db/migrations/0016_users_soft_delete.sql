ALTER TABLE users ADD COLUMN deleted_at timestamp;
CREATE INDEX idx_users_not_deleted ON users(deleted_at) WHERE deleted_at IS NULL;
