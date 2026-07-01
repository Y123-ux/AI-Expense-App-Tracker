import app from './app';
import Config from './config';
import { runMigrations } from './database/migrations';
import { seedCategories } from './database/seed';
import { ExpenseObserver } from './observers/ExpenseObserver';
import { NotificationObserver } from './observers/NotificationObserver';
import { logger } from './utils/logger';
import fs from 'fs';

const config = Config.getInstance();

// Ensure uploads directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

// Initialize database
runMigrations();
seedCategories();

// Initialize observers (Observer Pattern)
new ExpenseObserver();
new NotificationObserver();

// Start server
app.listen(config.port, () => {
  logger.success(`Server running on http://localhost:${config.port}`);
  logger.info(`OCR Provider: ${config.ocrProvider}`);
  logger.info(`LLM Provider: ${config.llmProvider}`);
});
