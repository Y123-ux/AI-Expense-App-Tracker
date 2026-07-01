import { Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../middleware/auth';
import Config from '../config';

// Avatar upload config
const avatarDir = path.join(Config.getInstance().uploadDir, 'avatars');
fs.mkdirSync(avatarDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${(req as AuthRequest).userId}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// MVC Pattern: Controller handles HTTP request/response
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const user = this.authService.getProfile(req.userId!);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const user = this.authService.updateProfile(req.userId!, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.changePassword(req.userId!, req.body);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };

  uploadAvatarMiddleware = avatarUpload.single('avatar');

  uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const user = this.authService.updateAvatar(req.userId!, avatarUrl);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
