import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO, LoginDTO, UpdateUserDTO, ChangePasswordDTO, UserResponse } from '../models/User';
import Config from '../config';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(data: CreateUserDTO): Promise<{ user: UserResponse; token: string }> {
    const existing = this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const id = uuidv4();

    const user = this.userRepo.create({
      id,
      email: data.email,
      password_hash: passwordHash,
      name: data.name,
      currency: 'USD',
    });

    const token = this.generateToken(user.id);

    return {
      user: this.toResponse(user),
      token,
    };
  }

  async login(data: LoginDTO): Promise<{ user: UserResponse; token: string }> {
    const user = this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      user: this.toResponse(user),
      token,
    };
  }

  getProfile(userId: string): UserResponse {
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.toResponse(user);
  }

  updateProfile(userId: string, data: UpdateUserDTO): UserResponse {
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updates: Record<string, unknown> = {};
    if (data.name) updates.name = data.name;
    if (data.currency) updates.currency = data.currency;

    const updated = this.userRepo.update(userId, updates);
    if (!updated) {
      throw new Error('Failed to update profile');
    }
    return this.toResponse(updated);
  }

  async changePassword(userId: string, data: ChangePasswordDTO): Promise<void> {
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password_hash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    if (data.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    const newHash = await bcrypt.hash(data.newPassword, 12);
    this.userRepo.update(userId, { password_hash: newHash });
  }

  updateAvatar(userId: string, avatarUrl: string): UserResponse {
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const updated = this.userRepo.update(userId, { avatar_url: avatarUrl });
    if (!updated) {
      throw new Error('Failed to update avatar');
    }
    return this.toResponse(updated);
  }

  private toResponse(user: { id: string; email: string; name: string; currency: string; avatar_url?: string | null; created_at: string }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      currency: user.currency,
      avatar_url: user.avatar_url ?? null,
      created_at: user.created_at,
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, Config.getInstance().jwtSecret, { expiresIn: '7d' });
  }
}
