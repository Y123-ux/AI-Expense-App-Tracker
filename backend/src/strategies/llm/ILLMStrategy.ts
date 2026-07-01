// Strategy Pattern: Interface for pluggable LLM providers
export interface ILLMStrategy {
  readonly name: string;

  categorizeExpense(merchant: string, description: string, categories: string[]): Promise<string>;

  generateMonthlySummary(expenses: Array<{
    merchant: string;
    amount: number;
    category: string;
    date: string;
  }>): Promise<string>;

  detectPatterns(expenses: Array<{
    merchant: string;
    amount: number;
    category: string;
    date: string;
  }>): Promise<string[]>;
}
