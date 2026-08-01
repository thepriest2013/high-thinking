CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved INTEGER NOT NULL DEFAULT 0,
  ip_hash TEXT NOT NULL
);

CREATE INDEX idx_comments_slug_approved ON comments (post_slug, approved);
