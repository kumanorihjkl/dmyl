import { Expense, ExpenseCalculation } from '../models/types';
import { getCategorySettings } from './storageService';

/**
 * Calculate expense values based on category settings
 */
export const calculateExpense = (expense: Expense, userAge: number): ExpenseCalculation => {
  const { frequency, annualCount, isLongTermInvestment } = getCategorySettings(expense.category);
  const amount = expense.amount;
  
  // Handle long-term investment
  if (isLongTermInvestment) {
    // Calculate remaining years based on age
    const years = userAge >= 60 ? 20 : (80 - userAge);
    
    return {
      daily: amount / (years * 365),
      monthly: amount / (years * 12),
      yearly: amount / years
    };
  }
  
  // Handle regular expenses
  if (frequency === 'regular') {
    // For monthly expenses (annualCount = 12)
    if (annualCount === 12) {
      return {
        daily: amount / 30, // Simplified: month = 30 days
        monthly: amount,
        yearly: amount * 12
      };
    }
    // For yearly expenses (annualCount = 1)
    else if (annualCount === 1) {
      return {
        daily: amount / 365,
        monthly: amount / 12,
        yearly: amount
      };
    }
    // For other regular expenses, treat as daily occurrence
    else {
      return {
        daily: amount,
        monthly: amount * 30, // Simplified: month = 30 days
        yearly: amount * 365
      };
    }
  } 
  // Handle irregular expenses
  else {
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
