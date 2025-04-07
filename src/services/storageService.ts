import { 
  Expense, 
  UserSettings, 
  DEFAULT_CATEGORY_SETTINGS,
  EXPENSE_CATEGORIES,
  CATEGORY_DISPLAY_NAMES,
  addCategory
} from '../models/types';

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
  
  // Restore custom categories if they exist
  if (parsedSettings.customCategories && Array.isArray(parsedSettings.customCategories)) {
    // For each custom category, ensure it's added to the global categories
    parsedSettings.customCategories.forEach(categoryId => {
      const categorySetting = parsedSettings.categorySettings.find(
        setting => setting.category === categoryId
      );
      
      if (categorySetting) {
        // If the category is not already in the global lists, add it
        if (!EXPENSE_CATEGORIES.includes(categoryId)) {
          // Get the display name from the settings or use the category ID as fallback
          const displayName = CATEGORY_DISPLAY_NAMES[categoryId] || categoryId;
          
          // We need to manually add this category to the global lists
          // But we can't directly modify the imported variables, so we'll use a workaround
          
          // First, create a temporary function to add a category with a specific ID
          const addCategoryWithId = (id: string, name: string, count: number, isLTI: boolean) => {
            // Use the module's exported variables indirectly
            if (!EXPENSE_CATEGORIES.includes(id)) {
              // @ts-ignore - We know this is mutable even though TypeScript thinks it's not
              EXPENSE_CATEGORIES.push(id);
              // @ts-ignore
              CATEGORY_DISPLAY_NAMES[id] = name;
              // @ts-ignore
              DEFAULT_CATEGORY_SETTINGS.push({ 
                category: id, 
                annualCount: count, 
                isLongTermInvestment: isLTI 
              });
            }
          };
          
          // Call our helper function
          addCategoryWithId(
            categoryId, 
            displayName, 
            categorySetting.annualCount, 
            categorySetting.isLongTermInvestment
          );
        }
      }
    });
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
export const getCategorySettings = (category: string): { annualCount: number, isLongTermInvestment: boolean } => {
  const userSettings = getUserSettings();
  const categorySetting = userSettings.categorySettings.find(setting => setting.category === category);
  
  if (categorySetting) {
    return {
      annualCount: categorySetting.annualCount,
      isLongTermInvestment: categorySetting.isLongTermInvestment
    };
  }
  
  // If not found, return default values based on category
  const defaultSetting = DEFAULT_CATEGORY_SETTINGS.find(setting => setting.category === category);
  
  if (defaultSetting) {
    return {
      annualCount: defaultSetting.annualCount,
      isLongTermInvestment: defaultSetting.isLongTermInvestment
    };
  }
  
  // Fallback to default values
  return { annualCount: 12, isLongTermInvestment: false };
};

/**
 * Update category settings
 */
export const updateCategorySettings = (
  category: string, 
  annualCount: number,
  isLongTermInvestment: boolean = false
): void => {
  const userSettings = getUserSettings();
  const index = userSettings.categorySettings.findIndex(setting => setting.category === category);
  
  if (index !== -1) {
    // Preserve the existing isLongTermInvestment value if not explicitly provided
    const currentIsLongTermInvestment = userSettings.categorySettings[index].isLongTermInvestment;
    userSettings.categorySettings[index] = { 
      category, 
      annualCount,
      isLongTermInvestment: isLongTermInvestment !== undefined ? isLongTermInvestment : currentIsLongTermInvestment
    };
  } else {
    userSettings.categorySettings.push({ 
      category, 
      annualCount,
      isLongTermInvestment: isLongTermInvestment || false
    });
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
    new Date(expense.date) >= oneYearAgo
  );
  
  // Return the count or default value
  return categoryExpenses.length > 0 ? categoryExpenses.length : getCategorySettings(category).annualCount;
};
