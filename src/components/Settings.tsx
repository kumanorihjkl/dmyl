import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { 
  EXPENSE_CATEGORIES, 
  CATEGORY_DISPLAY_NAMES,
  CategorySettings
} from '../models/types';
import { estimateAnnualCount } from '../services/storageService';

const Settings: React.FC = () => {
  const { userSettings, updateUserSettings, resetData, addCategory } = useExpense();
  const [age, setAge] = useState(userSettings.age.toString());
  const [categorySettings, setCategorySettings] = useState<CategorySettings[]>(userSettings.categorySettings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showEstimateConfirm, setShowEstimateConfirm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    displayName: '',
    annualCount: '12',
    isLongTermInvestment: false
  });
  
  // Load category settings from user settings
  useEffect(() => {
    setCategorySettings(userSettings.categorySettings);
  }, [userSettings.categorySettings]);

  // Handle age input change
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };
  
  
  // Handle annual count change
  const handleAnnualCountChange = (category: string, value: string) => {
    const count = parseInt(value);
    
    if (isNaN(count) || count < 0) {
      return;
    }
    
    setCategorySettings(prevSettings => {
      const newSettings = [...prevSettings];
      const index = newSettings.findIndex(setting => setting.category === category);
      
      if (index !== -1) {
        newSettings[index] = { ...newSettings[index], annualCount: count };
      } else {
        newSettings.push({ category, annualCount: count, isLongTermInvestment: false });
      }
      
      return newSettings;
    });
  };
  
  // Handle long-term investment flag change
  const handleLongTermInvestmentChange = (category: string, isLongTermInvestment: boolean) => {
    setCategorySettings(prevSettings => {
      const newSettings = [...prevSettings];
      const index = newSettings.findIndex(setting => setting.category === category);
      
      if (index !== -1) {
        newSettings[index] = { ...newSettings[index], isLongTermInvestment };
      } else {
        newSettings.push({ 
          category, 
          annualCount: 0, 
          isLongTermInvestment 
        });
      }
      
      return newSettings;
    });
  };
  
  // Estimate annual counts based on past data
  const handleEstimateAnnualCounts = () => {
    const newSettings = [...categorySettings];
    
    // Update all categories that are not long-term investments
    newSettings.forEach((setting, index) => {
      if (!setting.isLongTermInvestment) {
        newSettings[index] = {
          ...setting,
          annualCount: estimateAnnualCount(setting.category)
        };
      }
    });
    
    setCategorySettings(newSettings);
    setShowEstimateConfirm(false);
    
    // Show notification
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };
  
  // Handle new category input change
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle add new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newCategory.displayName) {
      alert('表示名は必須です。');
      return;
    }
    
    // Add the new category
    addCategory(
      newCategory.displayName,
      parseInt(newCategory.annualCount) || 12,
      newCategory.isLongTermInvestment
    );
    
    // Reset form
    setNewCategory({
      displayName: '',
      annualCount: '12',
      isLongTermInvestment: false
    });
    
    // Hide form
    setShowAddCategoryForm(false);
    
    // Show notification
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  // Handle save settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ageValue = parseInt(age);
    if (isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
      alert('年齢は1〜120の間で入力してください。');
      return;
    }
    
    updateUserSettings({
      age: ageValue,
      categorySettings,
      customCategories: userSettings.customCategories
    });
    
    // Show notification
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };
  
  // Get category setting
  const getCategorySetting = (category: string) => {
    return categorySettings.find(setting => setting.category === category) || 
      { category, annualCount: 12, isLongTermInvestment: false };
  };
  
  // Handle reset data
  const handleResetData = () => {
    resetData();
    setShowResetConfirm(false);
    
    // Show notification
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">設定</h2>
      
      <form onSubmit={handleSaveSettings}>
        {/* Age Setting */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">基本設定</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              年齢
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="age"
                value={age}
                onChange={handleAgeChange}
                min="1"
                max="120"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span className="ml-2 text-gray-600">歳</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              長期投資の換算計算に使用されます。
            </p>
          </div>
        </div>
        
        {/* Category Settings */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-800">カテゴリ設定</h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowAddCategoryForm(true)}
                className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-150"
              >
                新規カテゴリ追加
              </button>
              <button
                type="button"
                onClick={() => setShowEstimateConfirm(true)}
                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
              >
                過去データから推定
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-4 text-sm text-gray-600">
              カテゴリごとに年間発生回数を設定します。長期投資の場合は年間発生回数は使用されません。
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      年間発生回数
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      長期投資
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {EXPENSE_CATEGORIES.map(category => {
                    const setting = getCategorySetting(category);
                    return (
                      <tr key={category}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {CATEGORY_DISPLAY_NAMES[category]}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="number"
                            value={setting.annualCount}
                            onChange={(e) => handleAnnualCountChange(category, e.target.value)}
                            disabled={setting.isLongTermInvestment}
                            min="0"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
                          />
                          <span className="ml-1 text-sm text-gray-600">回/年</span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={setting.isLongTermInvestment}
                              onChange={(e) => handleLongTermInvestmentChange(category, e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm">長期投資</span>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              年間発生回数は、月額換算の計算に使用されます。例えば、衣服を年4回購入する場合、1回の支出額を12で割った金額が月額換算値となります。
            </p>
            <p className="mt-2 text-sm text-gray-500">
              長期投資フラグは、生涯にわたる投資を表します。このフラグがオンの場合、残りの寿命に基づいて計算されます。
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
          >
            データをリセット
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
          >
            設定を保存
          </button>
        </div>
      </form>
      
      {/* Estimate confirmation dialog */}
      {showEstimateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">過去データから推定</h3>
            <p className="text-gray-600 mb-6">
              過去1年間の支出データを分析して、不定期支出の年間発生回数を推定します。続行しますか？
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEstimateConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
              >
                キャンセル
              </button>
              <button
                onClick={handleEstimateAnnualCounts}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
              >
                推定する
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">データをリセット</h3>
            <p className="text-gray-600 mb-6">
              すべての支出データと設定がリセットされます。この操作は元に戻せません。続行しますか？
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
              >
                キャンセル
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Category Form */}
      {showAddCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">新規カテゴリ追加</h3>
            
            <form onSubmit={handleAddCategory}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    表示名
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={newCategory.displayName}
                    onChange={handleNewCategoryChange}
                    placeholder="例: 書籍"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="annualCount" className="block text-sm font-medium text-gray-700 mb-1">
                    年間発生回数
                  </label>
                  <input
                    type="number"
                    id="annualCount"
                    name="annualCount"
                    value={newCategory.annualCount}
                    onChange={handleNewCategoryChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isLongTermInvestment"
                      checked={newCategory.isLongTermInvestment}
                      onChange={handleNewCategoryChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">長期投資</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-150"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {showSaveNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
          設定を保存しました
        </div>
      )}
    </div>
  );
};

export default Settings;
