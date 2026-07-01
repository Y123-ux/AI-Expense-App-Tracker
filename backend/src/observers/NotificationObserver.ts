import EventBus, { AppEvent } from './EventBus';
import { Expense } from '../models/Expense';

// Observer Pattern: Listens for events and logs notifications
export class NotificationObserver {
  constructor() {
    this.registerListeners();
  }

  private registerListeners(): void {
    const eventBus = EventBus.getInstance();

    eventBus.on(AppEvent.EXPENSE_CREATED, (expense: Expense) => {
      console.log(`[Notification] New expense: $${expense.amount} at ${expense.merchant || 'Unknown'}`);
    });

    eventBus.on(AppEvent.CATEGORY_SUGGESTED, (data: { expenseId: string; categoryName: string }) => {
      console.log(`[Notification] Expense ${data.expenseId} auto-categorized as "${data.categoryName}"`);
    });

    eventBus.on(AppEvent.RECEIPT_SCANNED, (data: { receiptId: string; merchant: string }) => {
      console.log(`[Notification] Receipt ${data.receiptId} scanned - merchant: ${data.merchant}`);
    });

    console.log('[NotificationObserver] Registered listeners for notifications');
  }
}
