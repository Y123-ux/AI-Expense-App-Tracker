import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const controller = new CategoryController();

router.use(authMiddleware);

router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

export default router;
