import { EventEmitter } from 'events';

// Observer Pattern + Singleton: Centralized event bus for app-wide events
export enum AppEvent {
  EXPENSE_CREATED = 'expense:created',
  EXPENSE_UPDATED = 'expense:updated',
  EXPENSE_DELETED = 'expense:deleted',
  RECEIPT_SCANNED = 'receipt:scanned',
  CATEGORY_SUGGESTED = 'category:suggested',
}

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }
}

export default EventBus;
