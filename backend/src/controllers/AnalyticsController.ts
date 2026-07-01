import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { AuthRequest } from '../middleware/auth';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getDashboard = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const stats = this.analyticsService.getDashboardStats(req.userId!);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const summary = await this.analyticsService.getMonthlySummary(
        req.userId!,
        startDate as string,
        endDate as string
      );
      res.json({ summary });
    } catch (error) {
      next(error);
    }
  };

  getPatterns = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patterns = await this.analyticsService.getSpendingPatterns(req.userId!);
      res.json({ patterns });
    } catch (error) {
      next(error);
    }
  };
}
