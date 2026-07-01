import { Response, NextFunction } from 'express';
import { CategoryService } from '../services/CategoryService';
import { AuthRequest } from '../middleware/auth';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAll = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const categories = this.categoryService.getCategories(req.userId!);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  create = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const category = this.categoryService.createCategory(req.userId!, req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  delete = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      this.categoryService.deleteCategory(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
