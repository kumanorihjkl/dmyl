import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { 
  EXPENSE_CATEGORIES, 
  CATEGORY_DISPLAY_NAMES, 
  EXPENSE_TYPE_DISPLAY_NAMES 
} from '../models/types';

const InputForm: React.FC = () => {
  const { addExpense } = useExpense();
  const [showNotification, setShowNotification] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    category: 'food',
    amount: '',
    type: 'once',
    memo: ''
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.date || !formData.category || !formData.amount) {
      alert('日付、カテゴリ、金額は必須項目です。');
      return;
    }
    
    // Add expense
    addExpense({
      date: formData.date,
      category: formData.category,
      amount: Number(formData.amount),
      type: formData.type as 'once' | 'monthly' | 'yearly' | 'lifetime',
      memo: formData.memo
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'food',
      amount: '',
      type: 'once',
      memo: ''
    });
    
    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">支出を入力</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              日付
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {CATEGORY_DISPLAY_NAMES[category]}
                </option>
              ))}
            </select>
          </div>
          
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              金額 (円)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="1000"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              支出タイプ
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(EXPENSE_TYPE_DISPLAY_NAMES).map(([type, label]) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Memo */}
          <div className="md:col-span-2">
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
              メモ (任意)
            </label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
          >
            登録する
          </button>
        </div>
      </form>
      
      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
          支出を登録しました
        </div>
      )}
    </div>
  );
};

export default InputForm;
