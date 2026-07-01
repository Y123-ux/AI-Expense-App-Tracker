export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id: string | null;
  is_default: number;
}

export interface CreateCategoryDTO {
  name: string;
  icon?: string;
  color?: string;
}
