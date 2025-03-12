export interface Expense {
  id: string;           // Unique ID
  date: string;         // Date (YYYY-MM-DD)
  category: string;     // Category (food, rent, utilities, etc.)
  amount: number;       // Amount
  type: 'once' | 'monthly' | 'yearly' | 'lifetime'; // Expense type
  memo?: string;        // Optional memo
}

export interface UserSettings {
  age: number;          // User's age
}

export interface ExpenseCalculation {
  daily: number;
  monthly: number;
  yearly: number;
}

// Categories for expenses
export const EXPENSE_CATEGORIES = [
  'food',
  'housing',
  'transportation',
  'utilities',
  'healthcare',
  'entertainment',
  'education',
  'personal',
  'other'
];

// Display names for categories
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  food: '食費',
  housing: '住居費',
  transportation: '交通費',
  utilities: '光熱費',
  healthcare: '医療費',
  entertainment: '娯楽費',
  education: '教育費',
  personal: '個人支出',
  other: 'その他'
};

// Display names for expense types
export const EXPENSE_TYPE_DISPLAY_NAMES: Record<string, string> = {
  once: '単発',
  monthly: '月額',
  yearly: '年額',
  lifetime: '長期投資'
};
