import { Expense, UserSettings } from '../models/types';

// Keys for localStorage
const EXPENSES_KEY = 'expenses';
const USER_SETTINGS_KEY = 'userSettings';

// Default user settings
const DEFAULT_USER_SETTINGS: UserSettings = {
  age: 30
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
  return storedSettings ? JSON.parse(storedSettings) : DEFAULT_USER_SETTINGS;
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
