import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const controller = new AnalyticsController();

router.use(authMiddleware);

router.get('/dashboard', controller.getDashboard);
router.get('/summary', controller.getSummary);
router.get('/patterns', controller.getPatterns);

export default router;
