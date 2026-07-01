export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  currency: string;
  avatar_url: string | null;
  created_at: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  currency?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  currency: string;
  avatar_url: string | null;
  created_at: string;
}
