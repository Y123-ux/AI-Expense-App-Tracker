import { OCRResult } from '../../models/Receipt';

// Strategy Pattern: Interface for pluggable OCR providers
export interface IOCRStrategy {
  readonly name: string;
  extractText(imagePath: string): Promise<OCRResult>;
}
