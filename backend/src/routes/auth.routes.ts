import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();
const controller = new AuthController();

router.post('/register', validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);
router.get('/profile', authMiddleware, controller.getProfile);
router.put('/profile', authMiddleware, controller.updateProfile);
router.put('/password', authMiddleware, controller.changePassword);
router.post('/avatar', authMiddleware, controller.uploadAvatarMiddleware, controller.uploadAvatar);

export default router;
