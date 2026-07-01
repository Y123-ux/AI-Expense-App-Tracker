import { v4 as uuidv4 } from 'uuid';
import { ExpenseRepository } from '../repositories/ExpenseRepository';
import { CreateExpenseDTO, UpdateExpenseDTO, ExpenseWithCategory } from '../models/Expense';
import EventBus, { AppEvent } from '../observers/EventBus';

export class ExpenseService {
  private expenseRepo: ExpenseRepository;

  constructor() {
    this.expenseRepo = new ExpenseRepository();
  }

  getExpenses(userId: string, filters?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): ExpenseWithCategory[] {
    return this.expenseRepo.findByUserId(userId, filters);
  }

  getExpenseById(id: string, userId: string): ExpenseWithCategory | undefined {
    const expenses = this.expenseRepo.findByUserId(userId);
    return expenses.find((e) => e.id === id);
  }

  createExpense(userId: string, data: CreateExpenseDTO): ExpenseWithCategory {
    const id = uuidv4();

    const expense = this.expenseRepo.create({
      id,
      amount: data.amount,
      merchant: data.merchant || null,
      description: data.description || null,
      date: data.date,
      category_id: data.category_id || null,
      user_id: userId,
      receipt_id: data.receipt_id || null,
    });

    // Observer Pattern: Emit event for auto-categorization
    EventBus.getInstance().emit(AppEvent.EXPENSE_CREATED, expense);

    // Refetch with category join
    const result = this.getExpenseById(id, userId);
    return result || (expense as unknown as ExpenseWithCategory);
  }

  updateExpense(id: string, userId: string, data: UpdateExpenseDTO): ExpenseWithCategory | undefined {
    const expense = this.getExpenseById(id, userId);
    if (!expense) {
      throw new Error('Expense not found');
    }

    this.expenseRepo.update(id, data as Record<string, unknown>);
    EventBus.getInstance().emit(AppEvent.EXPENSE_UPDATED, { id, ...data });

    return this.getExpenseById(id, userId);
  }

  deleteExpense(id: string, userId: string): boolean {
    const expense = this.getExpenseById(id, userId);
    if (!expense) {
      throw new Error('Expense not found');
    }

    const deleted = this.expenseRepo.delete(id);
    if (deleted) {
      EventBus.getInstance().emit(AppEvent.EXPENSE_DELETED, { id });
    }
    return deleted;
  }
}
