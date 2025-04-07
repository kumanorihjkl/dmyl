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
  frequency: 'regular' | 'irregular'; // Regular (daily/monthly) or irregular (one-time/infrequent)
  annualCount: number;  // Annual occurrence count for irregular expenses
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

// Default category frequency settings
export const DEFAULT_CATEGORY_SETTINGS: CategorySettings[] = [
  { category: 'food', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'housing', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'transportation', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'utilities', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'healthcare', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'entertainment', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'education', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'personal', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'other', frequency: 'regular', annualCount: 0, isLongTermInvestment: false },
  { category: 'clothing', frequency: 'irregular', annualCount: 4, isLongTermInvestment: false },
  { category: 'party', frequency: 'irregular', annualCount: 6, isLongTermInvestment: false },
  { category: 'travel', frequency: 'irregular', annualCount: 2, isLongTermInvestment: false },
  { category: 'appliance', frequency: 'irregular', annualCount: 1, isLongTermInvestment: false }
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
