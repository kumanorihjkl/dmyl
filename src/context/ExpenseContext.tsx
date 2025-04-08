import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Expense, 
  UserSettings, 
  DEFAULT_CATEGORY_SETTINGS,
  EXPENSE_CATEGORIES,
  CATEGORY_DISPLAY_NAMES,
  addCategory as addCategoryToTypes 
} from '../models/types';
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
  updateCategoryAnnualCount: (category: string, annualCount: number) => void;
  updateCategoryLongTermInvestment: (category: string, isLongTermInvestment: boolean) => void;
  addCategory: (displayName: string, annualCount?: number, isLongTermInvestment?: boolean) => string;
  editCategory: (categoryId: string, displayName: string, annualCount?: number, isLongTermInvestment?: boolean) => void;
  deleteCategory: (categoryId: string) => void;
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
  
  
  // Update category annual count
  const updateCategoryAnnualCount = (category: string, annualCount: number) => {
    const currentSettings = userSettings.categorySettings.find(setting => setting.category === category);
    const isLongTermInvestment = currentSettings?.isLongTermInvestment || false;
    
    // Update in storage service
    const updatedSettings = { category, annualCount, isLongTermInvestment };
    
    // Update local state
    setUserSettings(prevSettings => {
      const newCategorySettings = [...prevSettings.categorySettings];
      const index = newCategorySettings.findIndex(setting => setting.category === category);
      
      if (index !== -1) {
        newCategorySettings[index] = { ...newCategorySettings[index], annualCount };
      } else {
        newCategorySettings.push({ category, annualCount, isLongTermInvestment });
      }
      
      return {
        ...prevSettings,
        categorySettings: newCategorySettings
      };
    });
  };
  
  // Update category long-term investment flag
  const updateCategoryLongTermInvestment = (category: string, isLongTermInvestment: boolean) => {
    const currentSettings = userSettings.categorySettings.find(setting => setting.category === category);
    const annualCount = currentSettings?.annualCount || 0;
    
    // Update in storage service
    const updatedSettings = { category, annualCount, isLongTermInvestment };
    
    // Update local state
    setUserSettings(prevSettings => {
      const newCategorySettings = [...prevSettings.categorySettings];
      const index = newCategorySettings.findIndex(setting => setting.category === category);
      
      if (index !== -1) {
        newCategorySettings[index] = { ...newCategorySettings[index], isLongTermInvestment };
      } else {
        newCategorySettings.push({ category, annualCount, isLongTermInvestment });
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

  // Add a new category
  const addCategory = (
    displayName: string, 
    annualCount: number = 12, 
    isLongTermInvestment: boolean = false
  ): string => {
    // Add category to types and get the generated ID
    const categoryId = addCategoryToTypes(displayName, annualCount, isLongTermInvestment);
    
    // Update user settings with the new category
    setUserSettings(prevSettings => {
      const newCategorySettings = [...prevSettings.categorySettings];
      const index = newCategorySettings.findIndex(setting => setting.category === categoryId);
      
      if (index === -1) {
        newCategorySettings.push({ 
          category: categoryId, 
          annualCount, 
          isLongTermInvestment 
        });
      }
      
      // Track custom categories
      const customCategories = prevSettings.customCategories || [];
      if (!customCategories.includes(categoryId)) {
        customCategories.push(categoryId);
      }
      
      // Save category display name
      const categoryDisplayNames = prevSettings.categoryDisplayNames || { ...CATEGORY_DISPLAY_NAMES };
      categoryDisplayNames[categoryId] = displayName;
      
      const updatedSettings = {
        ...prevSettings,
        categorySettings: newCategorySettings,
        customCategories,
        categoryDisplayNames
      };
      
      // Save to storage
      saveUserSettings(updatedSettings);
      
      return updatedSettings;
    });
    
    return categoryId;
  };

  // Edit a category
  const editCategory = (
    categoryId: string,
    displayName: string,
    annualCount: number = 12,
    isLongTermInvestment: boolean = false
  ): void => {
    // Only allow editing custom categories
    if (!categoryId.startsWith('custom_')) {
      console.warn('Cannot edit built-in category:', categoryId);
      return;
    }
    
    // Update the display name in the global map
    // @ts-ignore - We know this is mutable
    CATEGORY_DISPLAY_NAMES[categoryId] = displayName;
    
    // Update user settings with the edited category
    setUserSettings(prevSettings => {
      const newCategorySettings = [...prevSettings.categorySettings];
      const index = newCategorySettings.findIndex(setting => setting.category === categoryId);
      
      if (index !== -1) {
        newCategorySettings[index] = { 
          category: categoryId, 
          annualCount, 
          isLongTermInvestment 
        };
      } else {
        newCategorySettings.push({ 
          category: categoryId, 
          annualCount, 
          isLongTermInvestment 
        });
      }
      
      // Update category display name
      const categoryDisplayNames = prevSettings.categoryDisplayNames || { ...CATEGORY_DISPLAY_NAMES };
      categoryDisplayNames[categoryId] = displayName;
      
      const updatedSettings = {
        ...prevSettings,
        categorySettings: newCategorySettings,
        categoryDisplayNames
      };
      
      // Save to storage
      saveUserSettings(updatedSettings);
      
      return updatedSettings;
    });
  };
  
  // Delete a category
  const deleteCategory = (categoryId: string): void => {
    // Only allow deleting custom categories
    if (!categoryId.startsWith('custom_')) {
      console.warn('Cannot delete built-in category:', categoryId);
      return;
    }
    
    // Remove from EXPENSE_CATEGORIES
    const categoryIndex = EXPENSE_CATEGORIES.indexOf(categoryId);
    if (categoryIndex !== -1) {
      // @ts-ignore - We know this is mutable
      EXPENSE_CATEGORIES.splice(categoryIndex, 1);
    }
    
    // Remove from CATEGORY_DISPLAY_NAMES
    if (CATEGORY_DISPLAY_NAMES[categoryId]) {
      // @ts-ignore - We know this is mutable
      delete CATEGORY_DISPLAY_NAMES[categoryId];
    }
    
    // Update user settings to remove the category
    setUserSettings(prevSettings => {
      // Remove from categorySettings
      const newCategorySettings = prevSettings.categorySettings.filter(
        setting => setting.category !== categoryId
      );
      
      // Remove from customCategories
      const customCategories = prevSettings.customCategories || [];
      const updatedCustomCategories = customCategories.filter(id => id !== categoryId);
      
      // Remove from categoryDisplayNames
      const categoryDisplayNames = prevSettings.categoryDisplayNames || { ...CATEGORY_DISPLAY_NAMES };
      if (categoryDisplayNames[categoryId]) {
        delete categoryDisplayNames[categoryId];
      }
      
      const updatedSettings = {
        ...prevSettings,
        categorySettings: newCategorySettings,
        customCategories: updatedCustomCategories,
        categoryDisplayNames
      };
      
      // Save to storage
      saveUserSettings(updatedSettings);
      
      return updatedSettings;
    });
    
    // Update any expenses that used this category to use 'other' instead
    const allExpenses = getExpenses();
    const updatedExpenses = allExpenses.map(expense => {
      if (expense.category === categoryId) {
        return { ...expense, category: 'other' };
      }
      return expense;
    });
    
    // Save updated expenses
    saveExpenses(updatedExpenses);
    setExpenses(updatedExpenses);
  };

  const value = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    userSettings,
    updateUserSettings,
    updateCategoryAnnualCount,
    updateCategoryLongTermInvestment,
    addCategory,
    editCategory,
    deleteCategory,
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
