import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TransferMoneyPage from './pages/TransferMoneyPage';
// import ReceiveMoneyPage from './pages/ReceiveMoneyPage'; // Removed
import TransactionsPage from './pages/TransactionsPage'; // Added
import CardIssuancePage from './pages/CardIssuancePage';
import KYCPage from './pages/KYCPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transfer" element={<TransferMoneyPage />} />
          <Route path="transactions" element={<TransactionsPage />} /> {/* Changed route */}
          <Route path="cards" element={<CardIssuancePage />} />
          <Route path="kyc" element={<KYCPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
