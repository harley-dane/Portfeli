import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ErrorDisplay: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  );
};

const SuccessDisplay: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md my-4" role="alert">
      <p className="font-bold">Success</p>
      <p>{message}</p>
    </div>
  );
};

const TransferMoneyPage: React.FC = () => {
  const { user, refreshUserContext } = useAuth();
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!recipientIdentifier.trim() || !amount.trim() || !currency) {
      setError("All fields are required.");
      return false;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Amount must be a positive number.");
      return false;
    }
    if (recipientIdentifier.trim() === user?.email || recipientIdentifier.trim() === user?.username) {
      setError("You cannot send money to yourself.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/transfers/send', {
        recipientIdentifier,
        amount: parseFloat(amount),
        currency,
      });
      setSuccessMessage(response.data.message || \`Successfully sent \${amount} \${currency} to \${recipientIdentifier}!\`);
      setRecipientIdentifier('');
      setAmount('');
      if (refreshUserContext) await refreshUserContext();
    } catch (err) {
      console.error("Transfer failed", err);
      // @ts-ignore
      setError(err.response?.data?.message || "Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.kycStatus !== 'verified') {
    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-xl mt-10 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-3">KYC Verification Required</h1>
            <p className="text-gray-700 mb-4">You need to complete KYC verification before you can send money.</p>
            <Link to="/kyc" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium text-xs leading-tight uppercase rounded-md shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">
                Go to KYC Page
            </Link>
        </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-lg mx-auto bg-white rounded-xl shadow-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Send Money</h1>
      <ErrorDisplay message={error} />
      <SuccessDisplay message={successMessage} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="recipientIdentifier" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient's Email or Username
          </label>
          <input
            type="text" name="recipientIdentifier" id="recipientIdentifier" value={recipientIdentifier}
            onChange={(e) => setRecipientIdentifier(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Enter recipient's email or username"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number" name="amount" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
            min="0.01" step="0.01"
            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            name="currency" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        </div>

        <button
          type="submit" disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Processing Transfer...' : 'Send Money'}
        </button>
      </form>
    </div>
  );
};

export default TransferMoneyPage;
