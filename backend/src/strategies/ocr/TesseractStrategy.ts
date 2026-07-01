import Tesseract from 'tesseract.js';
import { IOCRStrategy } from './IOCRStrategy';
import { OCRResult, ParsedReceiptData } from '../../models/Receipt';

// Strategy Pattern: Tesseract.js OCR implementation
export class TesseractStrategy implements IOCRStrategy {
  readonly name = 'tesseract';

  async extractText(imagePath: string): Promise<OCRResult> {
    const { data } = await Tesseract.recognize(imagePath, 'eng', {
      logger: () => {},
    });

    const parsed = this.parseReceiptText(data.text);

    return {
      text: data.text,
      confidence: data.confidence,
      parsed,
    };
  }

  private parseReceiptText(text: string): ParsedReceiptData {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    const merchant = this.extractMerchant(lines);
    const amount = this.extractTotal(text);
    const date = this.extractDate(text);
    const items = this.extractItems(lines);

    return { merchant, amount, date, items, raw_text: text };
  }

  private extractMerchant(lines: string[]): string {
    // First non-empty line is usually the merchant name
    for (const line of lines) {
      if (line.length > 2 && !/^\d/.test(line) && !/^(date|time|receipt|invoice)/i.test(line)) {
        return line;
      }
    }
    return 'Unknown Merchant';
  }

  private extractTotal(text: string): number {
    // Look for total patterns like "Total: $12.34" or "TOTAL 12.34"
    const totalPatterns = [
      /total[\s:]*\$?([\d,]+\.?\d{0,2})/i,
      /grand\s*total[\s:]*\$?([\d,]+\.?\d{0,2})/i,
      /amount\s*due[\s:]*\$?([\d,]+\.?\d{0,2})/i,
      /balance\s*due[\s:]*\$?([\d,]+\.?\d{0,2})/i,
    ];

    for (const pattern of totalPatterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1].replace(',', ''));
      }
    }

    // Fallback: find the largest dollar amount
    const amounts = [...text.matchAll(/\$?([\d,]+\.\d{2})/g)]
      .map((m) => parseFloat(m[1].replace(',', '')))
      .filter((n) => !isNaN(n));

    return amounts.length > 0 ? Math.max(...amounts) : 0;
  }

  private extractDate(text: string): string {
    const datePatterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const parsed = new Date(match[1]);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
        return match[1];
      }
    }

    return new Date().toISOString().split('T')[0];
  }

  private extractItems(lines: string[]): Array<{ name: string; quantity: number; price: number }> {
    const items: Array<{ name: string; quantity: number; price: number }> = [];

    for (const line of lines) {
      // Match lines like "Item name  $12.34" or "2x Item name  12.34"
      const match = line.match(/^(\d+)?[x\s]*(.+?)\s+\$?([\d,]+\.\d{2})$/);
      if (match) {
        const quantity = match[1] ? parseInt(match[1]) : 1;
        const name = match[2].trim();
        const price = parseFloat(match[3].replace(',', ''));

        if (!/total|subtotal|tax|change|cash|credit|debit/i.test(name)) {
          items.push({ name, quantity, price });
        }
      }
    }

    return items;
  }
}
