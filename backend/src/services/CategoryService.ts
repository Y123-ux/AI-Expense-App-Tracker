import { v4 as uuidv4 } from 'uuid';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Category, CreateCategoryDTO } from '../models/Category';

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  getCategories(userId: string): Category[] {
    return this.categoryRepo.findForUser(userId);
  }

  createCategory(userId: string, data: CreateCategoryDTO): Category {
    const existing = this.categoryRepo.findByName(data.name, userId);
    if (existing) {
      throw new Error('Category with this name already exists');
    }

    return this.categoryRepo.create({
      id: uuidv4(),
      name: data.name,
      icon: data.icon || '📦',
      color: data.color || '#6B7280',
      user_id: userId,
      is_default: 0,
    });
  }

  deleteCategory(id: string, userId: string): boolean {
    const category = this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    if (category.is_default) {
      throw new Error('Cannot delete default categories');
    }
    if (category.user_id !== userId) {
      throw new Error('Not authorized');
    }
    return this.categoryRepo.delete(id);
  }
}
