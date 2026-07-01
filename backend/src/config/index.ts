import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Singleton Pattern: Single configuration instance shared across the app
class Config {
  private static instance: Config;

  readonly port: number;
  readonly jwtSecret: string;
  readonly dbPath: string;
  readonly uploadDir: string;
  readonly anthropicApiKey: string;
  readonly ocrProvider: 'tesseract' | 'python';
  readonly llmProvider: 'claude' | 'mock';
  readonly pythonOcrUrl: string;

  private constructor() {
    this.port = parseInt(process.env.PORT || '3000', 10);
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-me';
    this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../expense_tracker.db');
    this.uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
    this.ocrProvider = (process.env.OCR_PROVIDER as 'tesseract' | 'python') || 'tesseract';
    this.llmProvider = (process.env.LLM_PROVIDER as 'claude' | 'mock') || 'mock';
    this.pythonOcrUrl = process.env.PYTHON_OCR_URL || 'http://localhost:8000';
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export default Config;
