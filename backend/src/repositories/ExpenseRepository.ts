import { BaseRepository } from './BaseRepository';
import { Expense, ExpenseWithCategory } from '../models/Expense';

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super('expenses');
  }

  findByUserId(userId: string, filters?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): ExpenseWithCategory[] {
    let query = `
      SELECT e.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
    `;
    const params: unknown[] = [userId];

    if (filters?.startDate) {
      query += ' AND e.date >= ?';
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      query += ' AND e.date <= ?';
      params.push(filters.endDate);
    }
    if (filters?.categoryId) {
      query += ' AND e.category_id = ?';
      params.push(filters.categoryId);
    }
    if (filters?.search) {
      query += ' AND (e.merchant LIKE ? OR e.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY e.date DESC';

    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    if (filters?.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    return this.db.prepare(query).all(...params) as ExpenseWithCategory[];
  }

  getTotalByCategory(userId: string, startDate?: string, endDate?: string): Array<{
    category_id: string;
    category_name: string;
    category_icon: string;
    category_color: string;
    total: number;
    count: number;
  }> {
    let query = `
      SELECT
        c.id as category_id, c.name as category_name,
        c.icon as category_icon, c.color as category_color,
        SUM(e.amount) as total, COUNT(e.id) as count
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
    `;
    const params: unknown[] = [userId];

    if (startDate) {
      query += ' AND e.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND e.date <= ?';
      params.push(endDate);
    }

    query += ' GROUP BY c.id ORDER BY total DESC';

    return this.db.prepare(query).all(...params) as Array<{
      category_id: string;
      category_name: string;
      category_icon: string;
      category_color: string;
      total: number;
      count: number;
    }>;
  }

  getMonthlyTotals(userId: string, months: number = 12): Array<{
    month: string;
    total: number;
    count: number;
  }> {
    return this.db.prepare(`
      SELECT
        strftime('%Y-%m', date) as month,
        SUM(amount) as total,
        COUNT(id) as count
      FROM expenses
      WHERE user_id = ? AND date >= date('now', '-' || ? || ' months')
      GROUP BY month
      ORDER BY month ASC
    `).all(userId, months) as Array<{ month: string; total: number; count: number }>;
  }
}
