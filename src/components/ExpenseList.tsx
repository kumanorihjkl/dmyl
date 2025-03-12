import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { 
  Expense, 
  CATEGORY_DISPLAY_NAMES, 
  EXPENSE_TYPE_DISPLAY_NAMES,
  FREQUENCY_DISPLAY_NAMES
} from '../models/types';
import { calculateExpense, formatCurrency } from '../services/calculationService';
import { getCategorySettings } from '../services/storageService';

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense, userSettings } = useExpense();
  const [displayMode, setDisplayMode] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get display value based on mode
  const getDisplayValue = (expense: Expense): string => {
    const calculation = calculateExpense(expense, userSettings.age);
    
    switch (displayMode) {
      case 'daily':
        return formatCurrency(calculation.daily) + '/日';
      case 'monthly':
        return formatCurrency(calculation.monthly) + '/月';
      case 'yearly':
        return formatCurrency(calculation.yearly) + '/年';
      default:
        return formatCurrency(expense.amount);
    }
  };
  
  // Handle delete expense
  const handleDelete = (id: string) => {
    if (window.confirm('この支出を削除してもよろしいですか？')) {
      deleteExpense(id);
    }
  };
  
  // Get background color based on category and frequency
  const getCategoryColor = (category: string): string => {
    const { frequency } = getCategorySettings(category);
    
    // Base colors for regular expenses
    const regularColors: Record<string, string> = {
      food: 'bg-red-100',
      housing: 'bg-blue-100',
      transportation: 'bg-green-100',
      utilities: 'bg-yellow-100',
      healthcare: 'bg-purple-100',
      entertainment: 'bg-pink-100',
      education: 'bg-indigo-100',
      personal: 'bg-orange-100',
      other: 'bg-gray-100',
      clothing: 'bg-pink-200',
      party: 'bg-purple-200',
      travel: 'bg-blue-200',
      appliance: 'bg-yellow-200'
    };
    
    // Use a striped pattern for irregular expenses
    if (frequency === 'irregular') {
      return (regularColors[category] || 'bg-gray-100') + ' bg-stripes';
    }
    
    return regularColors[category] || 'bg-gray-100';
  };
  
  // Get frequency display for a category
  const getFrequencyDisplay = (category: string): string => {
    const { frequency, annualCount } = getCategorySettings(category);
    
    if (frequency === 'irregular' && annualCount > 0) {
      return `${FREQUENCY_DISPLAY_NAMES[frequency]} (${annualCount}回/年)`;
    }
    
    return FREQUENCY_DISPLAY_NAMES[frequency];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">支出一覧</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setDisplayMode('daily')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 
              ${displayMode === 'daily' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            日換算
          </button>
          <button
            onClick={() => setDisplayMode('monthly')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 
              ${displayMode === 'monthly' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            月換算
          </button>
          <button
            onClick={() => setDisplayMode('yearly')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 
              ${displayMode === 'yearly' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            年換算
          </button>
        </div>
      </div>
      
      {sortedExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          支出データがありません。新しい支出を入力してください。
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイプ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メモ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {CATEGORY_DISPLAY_NAMES[expense.category]}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {getFrequencyDisplay(expense.category)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {getDisplayValue(expense)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {EXPENSE_TYPE_DISPLAY_NAMES[expense.type]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {expense.memo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
