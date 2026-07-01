import EventBus, { AppEvent } from './EventBus';
import { Expense } from '../models/Expense';
import { LLMContext } from '../strategies/llm/LLMContext';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ExpenseRepository } from '../repositories/ExpenseRepository';

// Observer Pattern: Listens for expense events and triggers auto-categorization
export class ExpenseObserver {
  private llmContext: LLMContext;
  private categoryRepo: CategoryRepository;
  private expenseRepo: ExpenseRepository;

  constructor() {
    this.llmContext = new LLMContext();
    this.categoryRepo = new CategoryRepository();
    this.expenseRepo = new ExpenseRepository();
    this.registerListeners();
  }

  private registerListeners(): void {
    const eventBus = EventBus.getInstance();

    eventBus.on(AppEvent.EXPENSE_CREATED, (expense: Expense) => {
      this.handleExpenseCreated(expense).catch(console.error);
    });

    eventBus.on(AppEvent.RECEIPT_SCANNED, (data: { userId: string; receiptId: string; merchant: string }) => {
      console.log(`[ExpenseObserver] Receipt scanned: ${data.receiptId} for merchant: ${data.merchant}`);
    });

    console.log('[ExpenseObserver] Registered listeners for expense events');
  }

  private async handleExpenseCreated(expense: Expense): Promise<void> {
    // Auto-categorize if no category was assigned
    if (!expense.category_id && expense.merchant) {
      try {
        const categories = this.categoryRepo.findForUser(expense.user_id);
        const categoryNames = categories.map((c) => c.name);

        const suggestedCategory = await this.llmContext.categorizeExpense(
          expense.merchant,
          expense.description || '',
          categoryNames
        );

        const category = categories.find((c) => c.name === suggestedCategory);
        if (category) {
          this.expenseRepo.update(expense.id, { category_id: category.id });
          EventBus.getInstance().emit(AppEvent.CATEGORY_SUGGESTED, {
            expenseId: expense.id,
            categoryId: category.id,
            categoryName: category.name,
          });
          console.log(`[ExpenseObserver] Auto-categorized expense ${expense.id} as "${suggestedCategory}"`);
        }
      } catch (error) {
        console.error('[ExpenseObserver] Auto-categorization failed:', error);
      }
    }
  }
}
