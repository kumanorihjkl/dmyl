import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Navigation items
  const navItems = [
    { path: '/', label: '入力' },
    { path: '/list', label: '一覧' },
    { path: '/dashboard', label: 'ダッシュボード' },
    { path: '/settings', label: '設定' }
  ];
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">支出管理アプリ</h1>
          
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 
                  ${location.pathname === item.path
                    ? 'bg-white text-indigo-700'
                    : 'text-white hover:bg-indigo-500'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
