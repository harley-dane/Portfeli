import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import api from '../services/api'; // Keep for future data fetching

interface QuickLinkProps {
  to: string;
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
  disabledText?: string;
  highlight?: boolean;
}

const QuickLinkCard: React.FC<QuickLinkProps> = ({ to, title, description, icon, disabled, disabledText, highlight }) => {
  const baseClasses = "block p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105";
  const enabledClasses = `bg-white hover:shadow-xl ${highlight ? 'ring-2 ring-indigo-500' : ''}`;
  const disabledClasses = "bg-gray-200 cursor-not-allowed opacity-70 shadow-md";

  const content = (
    <>
      <div className={`text-4xl mb-3 ${disabled ? 'text-gray-400' : highlight ? 'text-indigo-600' : 'text-indigo-500'}`}>{icon}</div>
      <h3 className={`text-xl font-semibold mb-1 ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      {disabled && disabledText && <p className="text-xs text-red-500 mt-2 font-medium">{disabledText}</p>}
    </>
  );

  if (disabled) {
    return <div className={`${baseClasses} ${disabledClasses}`}>{content}</div>;
  }

  return <Link to={to} className={`${baseClasses} ${enabledClasses}`}>{content}</Link>;
};

const DashboardPage: React.FC = () => {
  const { user, refreshUserContext } = useAuth();
  const [isLoadingData, setIsLoadingData] = useState(false); // For any future async data on dashboard

  useEffect(() => {
    if (refreshUserContext) {
      refreshUserContext(); // Ensures latest user data like balance/KYC is available
    }
  }, [refreshUserContext]);

  if (!user) {
    // This should ideally be caught by ProtectedRoute or AuthProvider's loading state
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div>
        <p className="ml-3 text-gray-700">Loading user data...</p>
      </div>
    );
  }

  const kycVerified = user.kycStatus === 'verified';

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
        Welcome back, <span className="text-indigo-600">{user.username}</span>!
      </h1>

      <section className="mb-8 sm:mb-12 grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold mb-1 opacity-90">Account Balance</h2>
          {/* @ts-ignore */}
          <p className="text-4xl font-bold">\${(user.balance || 0).toFixed(2)}</p>
          <p className="text-sm opacity-80 mt-1">Available Funds</p>
        </div>
        <div className={`p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow ${kycVerified ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
          <h2 className="text-xl font-semibold mb-1 ${kycVerified ? 'opacity-90' : ''}`}>KYC Status</h2>
          <p className={`text-3xl font-bold capitalize`}>
            {user.kycStatus || 'Unknown'}
          </p>
          {!kycVerified && (
            <Link to="/kyc" className="mt-2 inline-block text-sm text-indigo-700 hover:text-indigo-900 font-semibold hover:underline">
              Complete KYC Verification &rarr;
            </Link>
          )}
           {kycVerified && <p className="text-sm opacity-90 mt-1">You're all set to use full features!</p>}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">What would you like to do?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!kycVerified && (
             <QuickLinkCard
                to="/kyc"
                icon="✅"
                title="Complete KYC"
                description="Verify your identity to unlock all features."
                highlight={true} // Make KYC card stand out if not verified
            />
          )}
          <QuickLinkCard
            to="/transfer"
            icon="💸"
            title="Send Money"
            description="Transfer funds securely."
            disabled={!kycVerified}
            disabledText={!kycVerified ? "KYC required" : undefined}
          />
          <QuickLinkCard
            to="/transactions"
            icon="📜"
            title="View Transactions"
            description="Check your payment history."
            // KYC typically not required to view history, but features might be limited.
            // For consistency in this app, let's keep it gated if other actions are.
            disabled={!kycVerified}
            disabledText={!kycVerified ? "KYC required" : undefined}
          />
          <QuickLinkCard
            to="/cards"
            icon="💳"
            title="Manage Cards"
            description="Request or view virtual cards."
            disabled={!kycVerified}
            disabledText={!kycVerified ? "KYC required" : undefined}
          />
        </div>
      </section>

      {/* Placeholder for Recent Activity - can be developed further */}
      {/*
      <section className="mt-10 sm:mt-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-500">No recent activity to display yet.</p>
        </div>
      </section>
      */}
    </div>
  );
};

export default DashboardPage;
