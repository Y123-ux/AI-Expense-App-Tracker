import { Router } from 'express';
import authRoutes from './auth.routes';
import expenseRoutes from './expense.routes';
import receiptRoutes from './receipt.routes';
import categoryRoutes from './category.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/receipts', receiptRoutes);
router.use('/categories', categoryRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
