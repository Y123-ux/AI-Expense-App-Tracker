import Anthropic from '@anthropic-ai/sdk';
import { ILLMStrategy } from './ILLMStrategy';
import Config from '../../config';

// Strategy Pattern: Claude API LLM implementation
export class ClaudeLLMStrategy implements ILLMStrategy {
  readonly name = 'claude';
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: Config.getInstance().anthropicApiKey,
    });
  }

  async categorizeExpense(merchant: string, description: string, categories: string[]): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Given this expense from merchant "${merchant}" with description "${description || 'N/A'}", which of these categories best fits? Categories: ${categories.join(', ')}. Reply with ONLY the category name, nothing else.`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
    const matched = categories.find((c) => c.toLowerCase() === text.toLowerCase());
    return matched || categories[categories.length - 1];
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
    const expenseList = expenses
      .map((e) => `- ${e.date}: ${e.merchant} (${e.category}) - $${e.amount.toFixed(2)}`)
      .join('\n');

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Analyze these expenses and provide a brief, friendly monthly spending summary with insights and saving tips.\n\nTotal: $${total.toFixed(2)}\nExpenses:\n${expenseList}\n\nProvide a 3-4 sentence natural language summary highlighting key spending areas and any notable patterns.`,
      }],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
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

    const expenseList = expenses
      .map((e) => `${e.date}: ${e.merchant} (${e.category}) - $${e.amount.toFixed(2)}`)
      .join('\n');

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Analyze these expense records and identify 3-5 spending patterns or insights. Return each pattern as a separate line starting with "- ".\n\nExpenses:\n${expenseList}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return text
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.trim().replace(/^-\s*/, ''));
  }
}
