import { Expense, ExpenseCalculation } from '../models/types';
import { getCategorySettings } from './storageService';

/**
 * Calculate daily, monthly, and yearly values for a one-time expense
 */
export const calculateOnceExpense = (amount: number, category: string): ExpenseCalculation => {
  const { frequency, annualCount } = getCategorySettings(category);
  
  if (frequency === 'regular') {
    // For regular expenses (like daily meals), treat as daily occurrence
    return {
      daily: amount,
      monthly: amount * 30, // Simplified: month = 30 days
      yearly: amount * 365
    };
  } else {
    // For irregular expenses (like clothing, party fees), use annual count
    // If annual count is 0, default to 1 to avoid division by zero
    const count = Math.max(annualCount, 1);
    
    return {
      daily: (amount * count) / 365,
      monthly: (amount * count) / 12,
      yearly: amount * count
    };
  }
};

/**
 * Calculate daily, monthly, and yearly values for a monthly expense
 */
export const calculateMonthlyExpense = (amount: number, category: string): ExpenseCalculation => {
  const { frequency, annualCount } = getCategorySettings(category);
  
  if (frequency === 'regular') {
    // For regular expenses, use standard monthly calculation
    return {
      daily: amount / 30, // Simplified: month = 30 days
      monthly: amount,
      yearly: amount * 12
    };
  } else {
    // For irregular expenses, adjust based on annual count
    const count = Math.max(annualCount, 1);
    const annualAmount = amount * 12; // Convert monthly to annual
    
    // Adjust annual amount based on actual occurrence count
    const adjustedAnnualAmount = (annualAmount / 12) * count;
    
    return {
      daily: adjustedAnnualAmount / 365,
      monthly: adjustedAnnualAmount / 12,
      yearly: adjustedAnnualAmount
    };
  }
};

/**
 * Calculate daily, monthly, and yearly values for a yearly expense
 */
export const calculateYearlyExpense = (amount: number, category: string): ExpenseCalculation => {
  const { frequency, annualCount } = getCategorySettings(category);
  
  if (frequency === 'regular') {
    // For regular expenses, use standard yearly calculation
    return {
      daily: amount / 365,
      monthly: amount / 12,
      yearly: amount
    };
  } else {
    // For irregular expenses, adjust based on annual count
    const count = Math.max(annualCount, 1);
    
    // Adjust annual amount based on actual occurrence count
    const adjustedAnnualAmount = (amount / 1) * count;
    
    return {
      daily: adjustedAnnualAmount / 365,
      monthly: adjustedAnnualAmount / 12,
      yearly: adjustedAnnualAmount
    };
  }
};

/**
 * Calculate daily, monthly, and yearly values for a lifetime investment
 */
export const calculateLifetimeExpense = (amount: number, userAge: number, category: string): ExpenseCalculation => {
  // Calculate remaining years based on age
  const years = userAge >= 60 ? 20 : (80 - userAge);
  
  const { frequency, annualCount } = getCategorySettings(category);
  
  if (frequency === 'regular') {
    // For regular expenses, use standard lifetime calculation
    return {
      daily: amount / (years * 365),
      monthly: amount / (years * 12),
      yearly: amount / years
    };
  } else {
    // For irregular expenses, adjust based on annual count
    const count = Math.max(annualCount, 1);
    
    // Adjust lifetime amount based on actual occurrence count
    // For lifetime expenses, we assume the count applies to each year of the remaining lifetime
    const adjustedLifetimeAmount = amount * (count / 1);
    
    return {
      daily: adjustedLifetimeAmount / (years * 365),
      monthly: adjustedLifetimeAmount / (years * 12),
      yearly: adjustedLifetimeAmount / years
    };
  }
};

/**
 * Calculate expense values based on expense type
 */
export const calculateExpense = (expense: Expense, userAge: number): ExpenseCalculation => {
  switch (expense.type) {
    case 'once':
      return calculateOnceExpense(expense.amount, expense.category);
    case 'monthly':
      return calculateMonthlyExpense(expense.amount, expense.category);
    case 'yearly':
      return calculateYearlyExpense(expense.amount, expense.category);
    case 'lifetime':
      return calculateLifetimeExpense(expense.amount, userAge, expense.category);
    default:
      return { daily: 0, monthly: 0, yearly: 0 };
  }
};

/**
 * Format currency amount to Japanese Yen
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Group expenses by category and calculate totals
 */
export const groupExpensesByCategory = (expenses: Expense[], userAge: number): Record<string, number> => {
  const result: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const { category } = expense;
    const calculation = calculateExpense(expense, userAge);
    
    if (!result[category]) {
      result[category] = 0;
    }
    
    // Use monthly value for consistency in charts
    result[category] += calculation.monthly;
  });
  
  return result;
};

/**
 * Group expenses by month and calculate totals
 */
export const groupExpensesByMonth = (expenses: Expense[], userAge: number): Record<string, number> => {
  const result: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const calculation = calculateExpense(expense, userAge);
    
    if (!result[monthKey]) {
      result[monthKey] = 0;
    }
    
    // Use monthly value for consistency in charts
    result[monthKey] += calculation.monthly;
  });
  
  return result;
};

/**
 * Filter expenses by date range
 */
export const filterExpensesByDateRange = (
  expenses: Expense[],
  startDate: Date,
  endDate: Date
): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

/**
 * Get expenses for the current month
 */
export const getCurrentMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return filterExpensesByDateRange(expenses, startOfMonth, endOfMonth);
};

/**
 * Get expenses for the current year
 */
export const getCurrentYearExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  
  return filterExpensesByDateRange(expenses, startOfYear, endOfYear);
};
