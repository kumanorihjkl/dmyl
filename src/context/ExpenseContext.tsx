import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, UserSettings, DEFAULT_CATEGORY_SETTINGS } from '../models/types';
import {
  getExpenses,
  saveExpenses,
  getUserSettings,
  saveUserSettings,
  resetAllData,
  updateCategorySettings
} from '../services/storageService';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  userSettings: UserSettings;
  updateUserSettings: (settings: UserSettings) => void;
  updateCategoryFrequency: (category: string, frequency: 'regular' | 'irregular') => void;
  updateCategoryAnnualCount: (category: string, annualCount: number) => void;
  resetData: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>({ 
    age: 30,
    categorySettings: DEFAULT_CATEGORY_SETTINGS
  });

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
  
  // Update category frequency
  const updateCategoryFrequency = (category: string, frequency: 'regular' | 'irregular') => {
    const currentSettings = userSettings.categorySettings.find(setting => setting.category === category);
    const annualCount = currentSettings?.annualCount || 0;
    
    updateCategorySettings(category, frequency, annualCount);
    
    // Update local state
    setUserSettings(prevSettings => {
      const newCategorySettings = [...prevSettings.categorySettings];
      const index = newCategorySettings.findIndex(setting => setting.category === category);
      
      if (index !== -1) {
        newCategorySettings[index] = { ...newCategorySettings[index], frequency };
      } else {
        newCategorySettings.push({ category, frequency, annualCount });
      }
      
      return {
        ...prevSettings,
        categorySettings: newCategorySettings
      };
    });
  };
  
  // Update category annual count
  const updateCategoryAnnualCount = (category: string, annualCount: number) => {
    const currentSettings = userSettings.categorySettings.find(setting => setting.category === category);
    const frequency = currentSettings?.frequency || 'regular';
    
    updateCategorySettings(category, frequency, annualCount);
    
    // Update local state
    setUserSettings(prevSettings => {
      const newCategorySettings = [...prevSettings.categorySettings];
      const index = newCategorySettings.findIndex(setting => setting.category === category);
      
      if (index !== -1) {
        newCategorySettings[index] = { ...newCategorySettings[index], annualCount };
      } else {
        newCategorySettings.push({ category, frequency, annualCount });
      }
      
      return {
        ...prevSettings,
        categorySettings: newCategorySettings
      };
    });
  };

  // Reset all data
  const resetData = () => {
    resetAllData();
    setExpenses([]);
    setUserSettings({ 
      age: 30,
      categorySettings: DEFAULT_CATEGORY_SETTINGS
    });
  };

  const value = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    userSettings,
    updateUserSettings,
    updateCategoryFrequency,
    updateCategoryAnnualCount,
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
