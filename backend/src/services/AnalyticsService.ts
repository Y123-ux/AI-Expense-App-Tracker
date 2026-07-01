import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { LLMContext } from '../strategies/llm/LLMContext';
import { getCurrentMonthRange } from '../utils/helpers';

export class AnalyticsService {
  private expenseRepo: ExpenseRepository;
  private llmContext: LLMContext;

  constructor() {
    this.expenseRepo = new ExpenseRepository();
    this.llmContext = new LLMContext();
  }

  getDashboardStats(userId: string): {
    totalThisMonth: number;
    transactionCount: number;
    avgTransaction: number;
    categoryBreakdown: Array<{
      category_id: string;
      category_name: string;
      category_icon: string;
      category_color: string;
      total: number;
      count: number;
    }>;
    monthlyTrend: Array<{ month: string; total: number; count: number }>;
  } {
    const { start, end } = getCurrentMonthRange();

    const categoryBreakdown = this.expenseRepo.getTotalByCategory(userId, start, end);
    const monthlyTrend = this.expenseRepo.getMonthlyTotals(userId, 12);

    const totalThisMonth = categoryBreakdown.reduce((sum, c) => sum + c.total, 0);
    const transactionCount = categoryBreakdown.reduce((sum, c) => sum + c.count, 0);
    const avgTransaction = transactionCount > 0 ? totalThisMonth / transactionCount : 0;

    return {
      totalThisMonth,
      transactionCount,
      avgTransaction,
      categoryBreakdown,
      monthlyTrend,
    };
  }

  async getMonthlySummary(userId: string, startDate?: string, endDate?: string): Promise<string> {
    const range = startDate && endDate
      ? { start: startDate, end: endDate }
      : getCurrentMonthRange();

    const expenses = this.expenseRepo.findByUserId(userId, {
      startDate: range.start,
      endDate: range.end,
    });

    const expenseData = expenses.map((e) => ({
      merchant: e.merchant || 'Unknown',
      amount: e.amount,
      category: e.category_name || 'Uncategorized',
      date: e.date,
    }));

    return this.llmContext.generateMonthlySummary(expenseData);
  }

  async getSpendingPatterns(userId: string): Promise<string[]> {
    const expenses = this.expenseRepo.findByUserId(userId, { limit: 100 });

    const expenseData = expenses.map((e) => ({
      merchant: e.merchant || 'Unknown',
      amount: e.amount,
      category: e.category_name || 'Uncategorized',
      date: e.date,
    }));

    return this.llmContext.detectPatterns(expenseData);
  }
}
