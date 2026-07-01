import { Request, Response, NextFunction } from 'express';

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required' });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  next();
}

export function validateExpense(req: Request, res: Response, next: NextFunction): void {
  const { amount, date } = req.body;

  if (amount === undefined || amount === null) {
    res.status(400).json({ error: 'Amount is required' });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Amount must be a positive number' });
    return;
  }

  if (!date) {
    res.status(400).json({ error: 'Date is required' });
    return;
  }

  next();
}
