import { Router } from 'express';
import { ReceiptController } from '../controllers/ReceiptController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new ReceiptController();

router.use(authMiddleware);

router.post('/scan', upload.single('receipt'), controller.scan);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
