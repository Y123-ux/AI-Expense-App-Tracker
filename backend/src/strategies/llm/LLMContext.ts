import { ILLMStrategy } from './ILLMStrategy';
import { ClaudeLLMStrategy } from './ClaudeLLMStrategy';
import { MockLLMStrategy } from './MockLLMStrategy';
import Config from '../../config';

// Strategy Pattern: Context class that delegates to the active LLM strategy
export class LLMContext {
  private strategy: ILLMStrategy;

  constructor(strategy?: ILLMStrategy) {
    if (strategy) {
      this.strategy = strategy;
    } else {
      const config = Config.getInstance();
      const apiKey = config.anthropicApiKey;
      const hasValidKey = apiKey && !apiKey.startsWith('your-');
      this.strategy = config.llmProvider === 'claude' && hasValidKey
        ? new ClaudeLLMStrategy()
        : new MockLLMStrategy();
    }
  }

  setStrategy(strategy: ILLMStrategy): void {
    this.strategy = strategy;
  }

  getStrategyName(): string {
    return this.strategy.name;
  }

  categorizeExpense(merchant: string, description: string, categories: string[]): Promise<string> {
    return this.strategy.categorizeExpense(merchant, description, categories);
  }

  generateMonthlySummary(expenses: Array<{
    merchant: string;
    amount: number;
    category: string;
    date: string;
  }>): Promise<string> {
    return this.strategy.generateMonthlySummary(expenses);
  }

  detectPatterns(expenses: Array<{
    merchant: string;
    amount: number;
    category: string;
    date: string;
  }>): Promise<string[]> {
    return this.strategy.detectPatterns(expenses);
  }
}
