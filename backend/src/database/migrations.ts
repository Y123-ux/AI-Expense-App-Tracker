import Database from './Database';

export function runMigrations(): void {
  const db = Database.getInstance().getConnection();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '📦',
      color TEXT DEFAULT '#6B7280',
      user_id TEXT,
      is_default INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      image_path TEXT NOT NULL,
      raw_text TEXT,
      parsed_data TEXT,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      merchant TEXT,
      description TEXT,
      date TEXT NOT NULL,
      category_id TEXT,
      user_id TEXT NOT NULL,
      receipt_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
    CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
    CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
  `);

  // Add currency column to existing DBs that don't have it
  try {
    db.exec(`ALTER TABLE users ADD COLUMN currency TEXT DEFAULT 'USD'`);
  } catch {
    // Column already exists, ignore
  }

  // Add avatar_url column to existing DBs that don't have it
  try {
    db.exec(`ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL`);
  } catch {
    // Column already exists, ignore
  }

  console.log('[Database] Migrations completed successfully');
}
