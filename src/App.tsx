import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

function App() {
  return (
    <ExpenseProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/list" element={<ExpenseList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ExpenseProvider>
  );
}

export default App;
