export interface Expense {
  id: string;           // Unique ID
  name?: string;        // Optional name for the expense
  date: string;         // Date (YYYY-MM-DD)
  category: string;     // Category (food, rent, utilities, etc.)
  amount: number;       // Amount
  memo?: string;        // Optional memo
}

export interface CategorySettings {
  category: string;     // Category name
  annualCount: number;  // Annual occurrence count
  isLongTermInvestment: boolean; // Whether this category is for long-term investments
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

// Default category settings
export const DEFAULT_CATEGORY_SETTINGS: CategorySettings[] = [
  { category: 'food', annualCount: 365, isLongTermInvestment: false },
  { category: 'housing', annualCount: 12, isLongTermInvestment: false },
  { category: 'transportation', annualCount: 365, isLongTermInvestment: false },
  { category: 'utilities', annualCount: 12, isLongTermInvestment: false },
  { category: 'healthcare', annualCount: 12, isLongTermInvestment: false },
  { category: 'entertainment', annualCount: 52, isLongTermInvestment: false },
  { category: 'education', annualCount: 12, isLongTermInvestment: false },
  { category: 'personal', annualCount: 52, isLongTermInvestment: false },
  { category: 'other', annualCount: 12, isLongTermInvestment: false },
  { category: 'clothing', annualCount: 4, isLongTermInvestment: false },
  { category: 'party', annualCount: 6, isLongTermInvestment: false },
  { category: 'travel', annualCount: 2, isLongTermInvestment: false },
  { category: 'appliance', annualCount: 1, isLongTermInvestment: false }
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
