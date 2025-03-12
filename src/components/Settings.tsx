import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

const Settings: React.FC = () => {
  const { userSettings, updateUserSettings, resetData } = useExpense();
  const [age, setAge] = useState(userSettings.age.toString());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  // Handle age input change
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
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
      ...userSettings,
      age: ageValue
    });
    
    // Show notification
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
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
        <div className="mb-6">
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
