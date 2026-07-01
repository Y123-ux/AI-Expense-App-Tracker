export interface Expense {
  id: string;
  amount: number;
  merchant: string | null;
  description: string | null;
  date: string;
  category_id: string | null;
  user_id: string;
  receipt_id: string | null;
  created_at: string;
}

export interface CreateExpenseDTO {
  amount: number;
  merchant?: string;
  description?: string;
  date: string;
  category_id?: string;
  receipt_id?: string;
}

export interface UpdateExpenseDTO {
  amount?: number;
  merchant?: string;
  description?: string;
  date?: string;
  category_id?: string;
}

export interface ExpenseWithCategory extends Expense {
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
}
