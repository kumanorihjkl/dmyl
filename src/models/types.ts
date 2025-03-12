export interface Expense {
  id: string;           // Unique ID
  date: string;         // Date (YYYY-MM-DD)
  category: string;     // Category (food, rent, utilities, etc.)
  amount: number;       // Amount
  type: 'once' | 'monthly' | 'yearly' | 'lifetime'; // Expense type
  memo?: string;        // Optional memo
}

export interface CategorySettings {
  category: string;     // Category name
  frequency: 'regular' | 'irregular'; // Regular (daily/monthly) or irregular (one-time/infrequent)
  annualCount: number;  // Annual occurrence count for irregular expenses
}

export interface UserSettings {
  age: number;          // User's age
  categorySettings: CategorySettings[]; // Category settings
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
  'other',
  'clothing',
  'party',
  'travel',
  'appliance'
];

// Default category frequency settings
export const DEFAULT_CATEGORY_SETTINGS: CategorySettings[] = [
  { category: 'food', frequency: 'regular', annualCount: 0 },
  { category: 'housing', frequency: 'regular', annualCount: 0 },
  { category: 'transportation', frequency: 'regular', annualCount: 0 },
  { category: 'utilities', frequency: 'regular', annualCount: 0 },
  { category: 'healthcare', frequency: 'regular', annualCount: 0 },
  { category: 'entertainment', frequency: 'regular', annualCount: 0 },
  { category: 'education', frequency: 'regular', annualCount: 0 },
  { category: 'personal', frequency: 'regular', annualCount: 0 },
  { category: 'other', frequency: 'regular', annualCount: 0 },
  { category: 'clothing', frequency: 'irregular', annualCount: 4 },
  { category: 'party', frequency: 'irregular', annualCount: 6 },
  { category: 'travel', frequency: 'irregular', annualCount: 2 },
  { category: 'appliance', frequency: 'irregular', annualCount: 1 }
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
  other: 'その他',
  clothing: '衣服',
  party: '交際費',
  travel: '旅行',
  appliance: '家電'
};

// Display names for frequency types
export const FREQUENCY_DISPLAY_NAMES: Record<string, string> = {
  regular: '定期的',
  irregular: '不定期'
};

// Display names for expense types
export const EXPENSE_TYPE_DISPLAY_NAMES: Record<string, string> = {
  once: '単発',
  monthly: '月額',
  yearly: '年額',
  lifetime: '長期投資'
};
