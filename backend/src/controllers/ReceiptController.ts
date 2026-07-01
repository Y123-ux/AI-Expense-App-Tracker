import { Response, NextFunction } from 'express';
import { ReceiptService } from '../services/ReceiptService';
import { AuthRequest } from '../middleware/auth';

export class ReceiptController {
  private receiptService: ReceiptService;

  constructor() {
    this.receiptService = new ReceiptService();
  }

  scan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image file uploaded' });
        return;
      }

      const result = await this.receiptService.scanReceipt(req.userId!, req.file.path);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const receipts = this.receiptService.getReceipts(req.userId!);
      res.json(receipts);
    } catch (error) {
      next(error);
    }
  };

  getById = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const receipt = this.receiptService.getReceiptById(req.params.id);
      if (!receipt) {
        res.status(404).json({ error: 'Receipt not found' });
        return;
      }
      res.json({
        ...receipt,
        parsed_data: receipt.parsed_data ? JSON.parse(receipt.parsed_data) : null,
      });
    } catch (error) {
      next(error);
    }
  };
}
