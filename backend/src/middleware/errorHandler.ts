import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error(err.message);

  if (err.message.includes('Invalid file type')) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message.includes('not found') || err.message.includes('Not found')) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err.message.includes('already') || err.message.includes('Invalid credentials')) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message.includes('Not authorized')) {
    res.status(403).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
