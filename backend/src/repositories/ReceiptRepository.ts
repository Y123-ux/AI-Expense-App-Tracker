import { BaseRepository } from './BaseRepository';
import { Receipt } from '../models/Receipt';

export class ReceiptRepository extends BaseRepository<Receipt> {
  constructor() {
    super('receipts');
  }

  findByUserId(userId: string): Receipt[] {
    return this.db
      .prepare('SELECT * FROM receipts WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as Receipt[];
  }
}
