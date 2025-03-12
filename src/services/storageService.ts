import { Expense, UserSettings, DEFAULT_CATEGORY_SETTINGS } from '../models/types';

// Keys for localStorage
const EXPENSES_KEY = 'expenses';
const USER_SETTINGS_KEY = 'userSettings';

// Default user settings
const DEFAULT_USER_SETTINGS: UserSettings = {
  age: 30,
  categorySettings: DEFAULT_CATEGORY_SETTINGS
};

/**
 * Get all expenses from localStorage
 */
export const getExpenses = (): Expense[] => {
  const storedExpenses = localStorage.getItem(EXPENSES_KEY);
  return storedExpenses ? JSON.parse(storedExpenses) : [];
};

/**
 * Save expenses to localStorage
 */
export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

/**
 * Add a new expense
 */
export const addExpense = (expense: Expense): void => {
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
};

/**
 * Update an existing expense
 */
export const updateExpense = (updatedExpense: Expense): void => {
  const expenses = getExpenses();
  const index = expenses.findIndex(expense => expense.id === updatedExpense.id);
  
  if (index !== -1) {
    expenses[index] = updatedExpense;
    saveExpenses(expenses);
  }
};

/**
 * Delete an expense
 */
export const deleteExpense = (id: string): void => {
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter(expense => expense.id !== id);
  saveExpenses(filteredExpenses);
};

/**
 * Get user settings from localStorage
 */
export const getUserSettings = (): UserSettings => {
  const storedSettings = localStorage.getItem(USER_SETTINGS_KEY);
  if (!storedSettings) {
    return DEFAULT_USER_SETTINGS;
  }
  
  const parsedSettings = JSON.parse(storedSettings) as UserSettings;
  
  // If the stored settings don't have categorySettings, add the default ones
  if (!parsedSettings.categorySettings) {
    parsedSettings.categorySettings = DEFAULT_CATEGORY_SETTINGS;
  }
  
  return parsedSettings;
};

/**
 * Save user settings to localStorage
 */
export const saveUserSettings = (settings: UserSettings): void => {
  localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
};

/**
 * Reset all data in localStorage
 */
export const resetAllData = (): void => {
  localStorage.removeItem(EXPENSES_KEY);
  localStorage.removeItem(USER_SETTINGS_KEY);
};

/**
 * Get category settings for a specific category
 */
export const getCategorySettings = (category: string): { frequency: 'regular' | 'irregular', annualCount: number } => {
  const userSettings = getUserSettings();
  const categorySetting = userSettings.categorySettings.find(setting => setting.category === category);
  
  if (categorySetting) {
    return {
      frequency: categorySetting.frequency,
      annualCount: categorySetting.annualCount
    };
  }
  
  // If not found, return default values based on category
  const defaultSetting = DEFAULT_CATEGORY_SETTINGS.find(setting => setting.category === category);
  
  if (defaultSetting) {
    return {
      frequency: defaultSetting.frequency,
      annualCount: defaultSetting.annualCount
    };
  }
  
  // Fallback to regular with 0 annual count
  return { frequency: 'regular', annualCount: 0 };
};

/**
 * Update category settings
 */
export const updateCategorySettings = (category: string, frequency: 'regular' | 'irregular', annualCount: number): void => {
  const userSettings = getUserSettings();
  const index = userSettings.categorySettings.findIndex(setting => setting.category === category);
  
  if (index !== -1) {
    userSettings.categorySettings[index] = { category, frequency, annualCount };
  } else {
    userSettings.categorySettings.push({ category, frequency, annualCount });
  }
  
  saveUserSettings(userSettings);
};

/**
 * Estimate annual count for a category based on past data
 */
export const estimateAnnualCount = (category: string): number => {
  const expenses = getExpenses();
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  
  // Filter expenses for the category in the past year
  const categoryExpenses = expenses.filter(expense => 
    expense.category === category && 
    expense.type === 'once' &&
    new Date(expense.date) >= oneYearAgo
  );
  
  // Return the count or default value
  return categoryExpenses.length > 0 ? categoryExpenses.length : getCategorySettings(category).annualCount;
};
