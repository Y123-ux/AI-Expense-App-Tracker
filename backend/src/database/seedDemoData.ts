import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import Database from './Database';
import { runMigrations } from './migrations';
import { seedCategories } from './seed';

const DEMO_USER = {
  id: 'demo-user',
  email: 'yusra@demo.com',
  password: 'demo123456',
  name: 'Yusra',
  currency: 'USD',
};

interface CategoryRow {
  id: string;
  name: string;
}

const EXPENSE_DATA: Record<string, { merchants: string[]; minAmount: number; maxAmount: number }> = {
  'Food & Dining': {
    merchants: ['Starbucks', 'McDonald\'s', 'Chipotle', 'Sushi Palace', 'Pizza Hut', 'Olive Garden', 'Panera Bread', 'Subway', 'Chick-fil-A', 'Thai Basil'],
    minAmount: 5,
    maxAmount: 65,
  },
  'Groceries': {
    merchants: ['Walmart', 'Costco', 'Whole Foods', 'Trader Joe\'s', 'Target Grocery', 'Aldi', 'Kroger'],
    minAmount: 25,
    maxAmount: 180,
  },
  'Transportation': {
    merchants: ['Uber', 'Lyft', 'Shell Gas Station', 'BP Gas', 'City Parking', 'Metro Card'],
    minAmount: 8,
    maxAmount: 60,
  },
  'Shopping': {
    merchants: ['Amazon', 'Nike Store', 'Target', 'Zara', 'Apple Store', 'IKEA', 'H&M', 'Best Buy'],
    minAmount: 15,
    maxAmount: 250,
  },
  'Entertainment': {
    merchants: ['Netflix', 'Spotify', 'AMC Cinemas', 'Concert Tickets', 'Steam Games', 'Book Store'],
    minAmount: 10,
    maxAmount: 85,
  },
  'Healthcare': {
    merchants: ['CVS Pharmacy', 'Walgreens', 'Doctor Visit', 'Dental Checkup', 'Eye Exam'],
    minAmount: 12,
    maxAmount: 150,
  },
  'Utilities': {
    merchants: ['Electric Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Gas Bill'],
    minAmount: 30,
    maxAmount: 120,
  },
  'Education': {
    merchants: ['Udemy Course', 'Amazon Books', 'Coursera', 'Skillshare', 'O\'Reilly Subscription'],
    minAmount: 10,
    maxAmount: 50,
  },
  'Travel': {
    merchants: ['Airbnb', 'Booking.com', 'Delta Airlines', 'Marriott Hotel', 'Enterprise Rental'],
    minAmount: 80,
    maxAmount: 350,
  },
};

// Weights for how many expenses each category gets per month (roughly)
const CATEGORY_WEIGHTS: Record<string, number> = {
  'Food & Dining': 4,
  'Groceries': 3,
  'Transportation': 2,
  'Shopping': 2,
  'Entertainment': 1.5,
  'Healthcare': 0.5,
  'Utilities': 1,
  'Education': 0.5,
  'Travel': 0.3,
};

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(year: number, month: number): string {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  let maxDay = daysInMonth;

  // For current month, don't go past today
  if (year === today.getFullYear() && month === today.getMonth()) {
    maxDay = Math.min(daysInMonth, today.getDate());
  }

  const day = Math.floor(Math.random() * maxDay) + 1;
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function seedDemoData(): void {
  const db = Database.getInstance().getConnection();

  // Check if demo data already exists
  const existingExpenses = db.prepare('SELECT COUNT(*) as count FROM expenses WHERE user_id = ?').get(DEMO_USER.id) as { count: number };
  if (existingExpenses.count > 0) {
    console.log('[Seed] Demo expenses already exist, skipping...');
    return;
  }

  // Create the demo user if not exists
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(DEMO_USER.id);
  if (!existingUser) {
    const passwordHash = bcrypt.hashSync(DEMO_USER.password, 12);
    db.prepare(
      'INSERT INTO users (id, email, password_hash, name, currency) VALUES (?, ?, ?, ?, ?)'
    ).run(DEMO_USER.id, DEMO_USER.email, passwordHash, DEMO_USER.name, DEMO_USER.currency);
    console.log(`[Seed] Created demo user "${DEMO_USER.name}" (${DEMO_USER.email})`);
  }

  // Get default category IDs
  const categories = db.prepare('SELECT id, name FROM categories WHERE is_default = 1').all() as CategoryRow[];
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    categoryMap.set(cat.name, cat.id);
  }

  const insertExpense = db.prepare(
    'INSERT INTO expenses (id, amount, merchant, description, date, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const expenses: Array<{ id: string; amount: number; merchant: string; description: string; date: string; categoryId: string }> = [];

  // Generate expenses for the last 12 months
  const now = new Date();
  for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = date.getFullYear();
    const month = date.getMonth();

    // More expenses in recent months
    const recentMultiplier = monthOffset <= 2 ? 1.5 : monthOffset <= 5 ? 1.2 : 1;

    for (const [categoryName, config] of Object.entries(EXPENSE_DATA)) {
      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) continue;

      const weight = CATEGORY_WEIGHTS[categoryName] || 1;
      const count = Math.round(weight * recentMultiplier);

      for (let i = 0; i < count; i++) {
        const merchant = pickRandom(config.merchants);
        expenses.push({
          id: uuidv4(),
          amount: randomBetween(config.minAmount, config.maxAmount),
          merchant,
          description: `${merchant} purchase`,
          date: randomDate(year, month),
          categoryId,
        });
      }
    }
  }

  // Insert all expenses in a transaction
  const insertAll = db.transaction(() => {
    for (const exp of expenses) {
      insertExpense.run(exp.id, exp.amount, exp.merchant, exp.description, exp.date, exp.categoryId, DEMO_USER.id);
    }
  });

  insertAll();
  console.log(`[Seed] Inserted ${expenses.length} demo expenses across 12 months`);
}

// Run directly if called as script
if (require.main === module) {
  runMigrations();
  seedCategories();
  seedDemoData();
  console.log('[Seed] Demo data seeding complete!');
}
