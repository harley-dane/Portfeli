import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

interface Transaction {
  id: string;
  senderId: string;
  senderUsername: string;
  recipientId: string;
  recipientUsername: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
}

const ErrorDisplay: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4 max-w-xl mx-auto" role="alert">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  );
};

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return; // Should not happen due to ProtectedRoute
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<{ transactions: Transaction[] }>('/user/transactions');
        setTransactions(response.data.transactions);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
        // @ts-ignore
        setError(err.response?.data?.message || "Failed to load transaction history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.kycStatus === 'verified') {
        fetchTransactions();
    } else if (user && user.kycStatus !== 'verified') {
        setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div>
        <p className="ml-3 text-gray-700">Loading transaction history...</p>
      </div>
    );
  }

  if (user && user.kycStatus !== 'verified') {
    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-xl mt-10 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-3">KYC Verification Required</h1>
            <p className="text-gray-700 mb-4">Please complete KYC verification to view your transaction history.</p>
            <Link to="/kyc" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium text-xs leading-tight uppercase rounded-md shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">
                Go to KYC Page
            </Link>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Transaction History</h1>
      <ErrorDisplay message={error} />
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {!error && transactions.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 py-10 px-6">You have no transactions yet.</p>
        )}
        {!error && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => {
                  const isSender = tx.senderId === user?.id;
                  const description = isSender
                    ? \`To: \${tx.recipientUsername}\`
                    : \`From: \${tx.senderUsername}\`;
                  const amountDisplay = isSender ? \`-\${tx.amount.toFixed(2)}\` : \`+\${tx.amount.toFixed(2)}\`;
                  const amountColor = isSender ? 'text-red-600' : 'text-green-600';

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{description}</td>
                      <td className={\`px-6 py-4 whitespace-nowrap text-sm \${amountColor} font-semibold text-right\`}>{amountDisplay} {tx.currency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
