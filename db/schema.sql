-- SmartLearn Phase 2 — local SQLite schema (mock data only, no real credentials)
-- Run locally for now: sqlite3 smartlearn.db < db/schema.sql
-- The file smartlearn.db itself is local-only and never committed.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,            -- 'guest', 'test-student', 'demo-teacher'
  display_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, subject),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS scores (
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  best INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, subject),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
