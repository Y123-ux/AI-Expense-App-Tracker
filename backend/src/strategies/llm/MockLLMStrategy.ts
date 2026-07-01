import { ILLMStrategy } from './ILLMStrategy';

// Strategy Pattern: Mock LLM for testing without API calls
export class MockLLMStrategy implements ILLMStrategy {
  readonly name = 'mock';

  private categoryMapping: Record<string, string> = {
    restaurant: 'Food & Dining',
    cafe: 'Food & Dining',
    coffee: 'Food & Dining',
    grocery: 'Groceries',
    supermarket: 'Groceries',
    walmart: 'Groceries',
    uber: 'Transportation',
    lyft: 'Transportation',
    gas: 'Transportation',
    amazon: 'Shopping',
    target: 'Shopping',
    mall: 'Shopping',
    netflix: 'Entertainment',
    spotify: 'Entertainment',
    cinema: 'Entertainment',
    pharmacy: 'Healthcare',
    hospital: 'Healthcare',
    doctor: 'Healthcare',
    electric: 'Utilities',
    water: 'Utilities',
    internet: 'Utilities',
  };

  async categorizeExpense(merchant: string, _description: string, categories: string[]): Promise<string> {
    const merchantLower = merchant.toLowerCase();

    for (const [keyword, category] of Object.entries(this.categoryMapping)) {
      if (merchantLower.includes(keyword)) {
        const match = categories.find((c) => c.toLowerCase() === category.toLowerCase());
        if (match) return match;
      }
    }

    return categories.find((c) => c.toLowerCase() === 'other') || categories[categories.length - 1];
  }

  async generateMonthlySummary(expenses: Array<{
    merchant: string;
    amount: number;
    category: string;
    date: string;
  }>): Promise<string> {
    if (expenses.length === 0) {
      return 'No expenses recorded this period.';
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals: Record<string, number> = {};

    for (const e of expenses) {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }

    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];

    return `This month you spent a total of $${total.toFixed(2)} across ${expenses.length} transactions. Your biggest spending category was ${topCategory[0]} at $${topCategory[1].toFixed(2)}. Consider reviewing your ${topCategory[0]} expenses for potential savings.`;
  }

  async detectPatterns(expenses: Array<{
    merchant: string;
    amount: number;
    category: string;
    date: string;
  }>): Promise<string[]> {
    if (expenses.length < 3) {
      return ['Not enough data to detect patterns yet. Keep tracking your expenses!'];
    }

    const patterns: string[] = [];
    const merchantCounts: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};

    for (const e of expenses) {
      merchantCounts[e.merchant] = (merchantCounts[e.merchant] || 0) + 1;
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }

    const topMerchant = Object.entries(merchantCounts).sort(([, a], [, b]) => b - a)[0];
    if (topMerchant && topMerchant[1] > 1) {
      patterns.push(`You frequently shop at ${topMerchant[0]} (${topMerchant[1]} times)`);
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
    if (topCategory) {
      const pct = ((topCategory[1] / total) * 100).toFixed(0);
      patterns.push(`${topCategory[0]} accounts for ${pct}% of your spending`);
    }

    const avg = total / expenses.length;
    patterns.push(`Your average transaction is $${avg.toFixed(2)}`);

    return patterns;
  }
}
