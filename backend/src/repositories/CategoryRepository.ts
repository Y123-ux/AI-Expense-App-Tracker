import { BaseRepository } from './BaseRepository';
import { Category } from '../models/Category';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('categories');
  }

  findForUser(userId: string): Category[] {
    return this.db
      .prepare('SELECT * FROM categories WHERE user_id = ? OR is_default = 1 ORDER BY name ASC')
      .all(userId) as Category[];
  }

  findByName(name: string, userId?: string): Category | undefined {
    if (userId) {
      return this.db
        .prepare('SELECT * FROM categories WHERE LOWER(name) = LOWER(?) AND (user_id = ? OR is_default = 1)')
        .get(name, userId) as Category | undefined;
    }
    return this.db
      .prepare('SELECT * FROM categories WHERE LOWER(name) = LOWER(?) AND is_default = 1')
      .get(name) as Category | undefined;
  }
}
