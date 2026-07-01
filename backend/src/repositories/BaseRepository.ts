import BetterSqlite3 from 'better-sqlite3';
import Database from '../database/Database';

// Repository Pattern: Abstract base class for data access
export abstract class BaseRepository<T> {
  protected db: BetterSqlite3.Database;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = Database.getInstance().getConnection();
    this.tableName = tableName;
  }

  findAll(conditions?: Record<string, unknown>): T[] {
    if (!conditions || Object.keys(conditions).length === 0) {
      return this.db.prepare(`SELECT * FROM ${this.tableName}`).all() as T[];
    }

    const where = Object.keys(conditions)
      .map((key) => `${key} = @${key}`)
      .join(' AND ');

    return this.db
      .prepare(`SELECT * FROM ${this.tableName} WHERE ${where}`)
      .all(conditions) as T[];
  }

  findById(id: string): T | undefined {
    return this.db
      .prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
      .get(id) as T | undefined;
  }

  create(data: Record<string, unknown>): T {
    const keys = Object.keys(data);
    const placeholders = keys.map((k) => `@${k}`).join(', ');
    const columns = keys.join(', ');

    this.db
      .prepare(`INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`)
      .run(data);

    return this.findById(data.id as string) as T;
  }

  update(id: string, data: Record<string, unknown>): T | undefined {
    const sets = Object.keys(data)
      .map((key) => `${key} = @${key}`)
      .join(', ');

    this.db
      .prepare(`UPDATE ${this.tableName} SET ${sets} WHERE id = @id`)
      .run({ ...data, id });

    return this.findById(id);
  }

  delete(id: string): boolean {
    const result = this.db
      .prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .run(id);

    return result.changes > 0;
  }

  count(conditions?: Record<string, unknown>): number {
    if (!conditions || Object.keys(conditions).length === 0) {
      const row = this.db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`).get() as { count: number };
      return row.count;
    }

    const where = Object.keys(conditions)
      .map((key) => `${key} = @${key}`)
      .join(' AND ');

    const row = this.db
      .prepare(`SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${where}`)
      .get(conditions) as { count: number };

    return row.count;
  }
}
