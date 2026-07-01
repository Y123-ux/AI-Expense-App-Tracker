import { v4 as uuidv4 } from 'uuid';
import Database from './Database';
import { runMigrations } from './migrations';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#AA1C41' },
  { name: 'Groceries', icon: '🛒', color: '#E68457' },
  { name: 'Transportation', icon: '🚗', color: '#5E244E' },
  { name: 'Shopping', icon: '🛍️', color: '#C98AB7' },
  { name: 'Entertainment', icon: '🎬', color: '#8E3D6E' },
  { name: 'Healthcare', icon: '🏥', color: '#D4713E' },
  { name: 'Utilities', icon: '💡', color: '#E68457' },
  { name: 'Education', icon: '📚', color: '#4A1C3E' },
  { name: 'Travel', icon: '✈️', color: '#D44B6A' },
  { name: 'Other', icon: '📦', color: '#6B7280' },
];

export function seedCategories(): void {
  const db = Database.getInstance().getConnection();

  const existingCount = db.prepare('SELECT COUNT(*) as count FROM categories WHERE is_default = 1').get() as { count: number };

  if (existingCount.count > 0) {
    console.log('[Seed] Default categories already exist, skipping...');
    return;
  }

  const insert = db.prepare(
    'INSERT INTO categories (id, name, icon, color, is_default) VALUES (?, ?, ?, ?, 1)'
  );

  const insertMany = db.transaction(() => {
    for (const cat of DEFAULT_CATEGORIES) {
      insert.run(uuidv4(), cat.name, cat.icon, cat.color);
    }
  });

  insertMany();
  console.log(`[Seed] Inserted ${DEFAULT_CATEGORIES.length} default categories`);
}

// Run directly if called as script
if (require.main === module) {
  runMigrations();
  seedCategories();
  console.log('[Seed] Done!');
}
