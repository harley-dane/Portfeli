import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleKycRedirect = () => {
    navigate('/kyc');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl hover:text-indigo-300 transition-colors">
                PayMenu
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Home</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Dashboard</Link>
                  {user.kycStatus === 'verified' && (
                    <>
                      <Link to="/transfer" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Transfer</Link>
                      <Link to="/transactions" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Transactions</Link>
                      <Link to="/cards" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Cards</Link>
                    </>
                  )}
                  {user.kycStatus !== 'verified' && (
                    <button
                      onClick={handleKycRedirect}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-black transition-colors"
                    >
                      Complete KYC
                    </button>
                  )}
                  <span className="text-sm text-gray-300">Hi, {user.username}!</span>
                  <button
                    onClick={logout}
                    disabled={authLoading}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Login</Link>
                  <Link to="/signup" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors">Sign Up</Link>
                </>
              )}
            </div>
            {/* Mobile menu button can be added here if needed */}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow w-full">
        {authLoading && !user ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
            <p className="ml-3 text-gray-700">Loading application...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 text-center p-6 mt-auto">
        <p>&copy; {currentYear} PayMenu App. All rights reserved.</p>
        <p className="text-xs mt-1">Secure and Reliable Global Payments.</p>
      </footer>
    </div>
  );
};

export default Layout;
