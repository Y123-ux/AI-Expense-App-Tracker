import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import { authMiddleware } from '../middleware/auth';
import { validateExpense } from '../middleware/validation';

const router = Router();
const controller = new ExpenseController();

router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateExpense, controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
