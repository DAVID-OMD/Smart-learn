-- SmartLearn Phase 2 — mock seed (test users + zeroed progress, mock only)
-- Run locally: sqlite3 smartlearn.db < db/seed.sql

INSERT OR IGNORE INTO users (id, display_name) VALUES
  ('guest', 'Guest'),
  ('test-student', 'Test Student'),
  ('demo-teacher', 'Demo Teacher');

INSERT OR IGNORE INTO progress (user_id, subject, completed) VALUES
  ('guest', 'Mathematics', 0),
  ('guest', 'Science', 0),
  ('guest', 'English', 0),
  ('guest', 'History', 0);

INSERT OR IGNORE INTO scores (user_id, subject, best) VALUES
  ('guest', 'Mathematics', 0),
  ('guest', 'Science', 0),
  ('guest', 'English', 0),
  ('guest', 'History', 0);
