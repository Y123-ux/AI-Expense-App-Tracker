import { v4 as uuidv4 } from 'uuid';
import { ReceiptRepository } from '../repositories/ReceiptRepository';
import { Receipt, ParsedReceiptData } from '../models/Receipt';
import { OCRContext } from '../strategies/ocr/OCRContext';
import { ExpenseService } from './ExpenseService';
import EventBus, { AppEvent } from '../observers/EventBus';

export class ReceiptService {
  private receiptRepo: ReceiptRepository;
  private ocrContext: OCRContext;
  private expenseService: ExpenseService;

  constructor() {
    this.receiptRepo = new ReceiptRepository();
    this.ocrContext = new OCRContext();
    this.expenseService = new ExpenseService();
  }

  async scanReceipt(userId: string, imagePath: string): Promise<{
    receipt: Receipt;
    parsed: ParsedReceiptData;
    expense: unknown;
  }> {
    // Run OCR using the configured strategy
    const ocrResult = await this.ocrContext.extractText(imagePath);

    const receiptId = uuidv4();

    // Save receipt record
    const receipt = this.receiptRepo.create({
      id: receiptId,
      image_path: imagePath,
      raw_text: ocrResult.text,
      parsed_data: JSON.stringify(ocrResult.parsed),
      user_id: userId,
    });

    // Auto-create an expense from the parsed data
    const expense = this.expenseService.createExpense(userId, {
      amount: ocrResult.parsed.amount,
      merchant: ocrResult.parsed.merchant,
      description: `Receipt scan - ${ocrResult.parsed.items.length} items`,
      date: ocrResult.parsed.date,
      receipt_id: receiptId,
    });

    // Observer Pattern: Emit receipt scanned event
    EventBus.getInstance().emit(AppEvent.RECEIPT_SCANNED, {
      userId,
      receiptId,
      merchant: ocrResult.parsed.merchant,
    });

    return { receipt, parsed: ocrResult.parsed, expense };
  }

  getReceipts(userId: string): Receipt[] {
    return this.receiptRepo.findByUserId(userId);
  }

  getReceiptById(id: string): Receipt | undefined {
    return this.receiptRepo.findById(id);
  }
}
