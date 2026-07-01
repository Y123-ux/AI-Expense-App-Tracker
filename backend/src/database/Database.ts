import BetterSqlite3 from 'better-sqlite3';
import Config from '../config';

// Singleton Pattern: Single database connection shared across the app
class Database {
  private static instance: Database;
  private db: BetterSqlite3.Database;

  private constructor() {
    const config = Config.getInstance();
    this.db = new BetterSqlite3(config.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getConnection(): BetterSqlite3.Database {
    return this.db;
  }

  close(): void {
    this.db.close();
  }
}

export default Database;
