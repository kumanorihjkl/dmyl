import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { 
  groupExpensesByCategory, 
  groupExpensesByMonth, 
  formatCurrency,
  getCurrentMonthExpenses,
  getCurrentYearExpenses,
  filterExpensesByDateRange
} from '../services/calculationService';
import { CATEGORY_DISPLAY_NAMES } from '../models/types';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Date range options
type DateRange = 'month' | 'year' | 'custom';

const Dashboard: React.FC = () => {
  const { expenses, userSettings } = useExpense();
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [customStartDate, setCustomStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Filtered expenses based on date range
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  
  // Update filtered expenses when date range changes
  useEffect(() => {
    let filtered;
    
    switch (dateRange) {
      case 'month':
        filtered = getCurrentMonthExpenses(expenses);
        break;
      case 'year':
        filtered = getCurrentYearExpenses(expenses);
        break;
      case 'custom':
        filtered = filterExpensesByDateRange(
          expenses,
          new Date(customStartDate),
          new Date(customEndDate)
        );
        break;
      default:
        filtered = expenses;
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, dateRange, customStartDate, customEndDate]);
  
  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category for pie chart
  const expensesByCategory = groupExpensesByCategory(filteredExpenses, userSettings.age);
  
  // Group expenses by month for bar chart
  const expensesByMonth = groupExpensesByMonth(filteredExpenses, userSettings.age);
  
  // Prepare data for pie chart
  const pieChartData = {
    labels: Object.keys(expensesByCategory).map(category => CATEGORY_DISPLAY_NAMES[category]),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384', // red
          '#36A2EB', // blue
          '#FFCE56', // yellow
          '#4BC0C0', // teal
          '#9966FF', // purple
          '#FF9F40', // orange
          '#8AC926', // green
          '#F15BB5', // pink
          '#9C9C9C'  // gray
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare data for bar chart
  const barChartData = {
    labels: Object.keys(expensesByMonth).map(month => {
      const [year, monthNum] = month.split('-');
      return `${year}年${monthNum}月`;
    }),
    datasets: [
      {
        label: '支出',
        data: Object.values(expensesByMonth),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: string | number) {
            return typeof value === 'number' ? formatCurrency(value) : value;
          }
        }
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">ダッシュボード</h2>
      
      {/* Date range selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 
              ${dateRange === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            今月
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 
              ${dateRange === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            今年
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 
              ${dateRange === 'custom' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            カスタム期間
          </button>
        </div>
        
        {dateRange === 'custom' && (
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                開始日
              </label>
              <input
                type="date"
                id="startDate"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                終了日
              </label>
              <input
                type="date"
                id="endDate"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Total amount */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-2">期間内の合計支出</h3>
        <p className="text-3xl font-bold text-indigo-600">{formatCurrency(totalAmount)}</p>
      </div>
      
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          選択した期間内の支出データがありません。
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">カテゴリ別支出</h3>
            <div className="h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
          
          {/* Bar chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">月別支出推移</h3>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
