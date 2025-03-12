import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, UserSettings } from '../models/types';
import {
  getExpenses,
  saveExpenses,
  getUserSettings,
  saveUserSettings,
  resetAllData
} from '../services/storageService';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  userSettings: UserSettings;
  updateUserSettings: (settings: UserSettings) => void;
  resetData: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>({ age: 30 });

  // Load data from localStorage on initial render
  useEffect(() => {
    setExpenses(getExpenses());
    setUserSettings(getUserSettings());
  }, []);

  // Add a new expense
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4()
    };
    
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  // Update an existing expense
  const updateExpense = (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  // Update user settings
  const updateUserSettings = (settings: UserSettings) => {
    setUserSettings(settings);
    saveUserSettings(settings);
  };

  // Reset all data
  const resetData = () => {
    resetAllData();
    setExpenses([]);
    setUserSettings({ age: 30 });
  };

  const value = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    userSettings,
    updateUserSettings,
    resetData
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the expense context
export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  
  return context;
};
