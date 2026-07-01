import { Response, NextFunction } from 'express';
import { ExpenseService } from '../services/ExpenseService';
import { AuthRequest } from '../middleware/auth';

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor() {
    this.expenseService = new ExpenseService();
  }

  getAll = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const { startDate, endDate, categoryId, search, limit, offset } = req.query;
      const expenses = this.expenseService.getExpenses(req.userId!, {
        startDate: startDate as string,
        endDate: endDate as string,
        categoryId: categoryId as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(expenses);
    } catch (error) {
      next(error);
    }
  };

  getById = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const expense = this.expenseService.getExpenseById(req.params.id, req.userId!);
      if (!expense) {
        res.status(404).json({ error: 'Expense not found' });
        return;
      }
      res.json(expense);
    } catch (error) {
      next(error);
    }
  };

  create = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const expense = this.expenseService.createExpense(req.userId!, req.body);
      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  };

  update = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const expense = this.expenseService.updateExpense(req.params.id, req.userId!, req.body);
      res.json(expense);
    } catch (error) {
      next(error);
    }
  };

  delete = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      this.expenseService.deleteExpense(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
