import { IOCRStrategy } from './IOCRStrategy';
import { TesseractStrategy } from './TesseractStrategy';
import { PythonOCRStrategy } from './PythonOCRStrategy';
import { OCRResult } from '../../models/Receipt';
import Config from '../../config';

// Strategy Pattern: Context class that delegates to the active OCR strategy
export class OCRContext {
  private strategy: IOCRStrategy;

  constructor(strategy?: IOCRStrategy) {
    if (strategy) {
      this.strategy = strategy;
    } else {
      const provider = Config.getInstance().ocrProvider;
      this.strategy = provider === 'python'
        ? new PythonOCRStrategy()
        : new TesseractStrategy();
    }
  }

  setStrategy(strategy: IOCRStrategy): void {
    this.strategy = strategy;
  }

  getStrategyName(): string {
    return this.strategy.name;
  }

  async extractText(imagePath: string): Promise<OCRResult> {
    return this.strategy.extractText(imagePath);
  }
}
