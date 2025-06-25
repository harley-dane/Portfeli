import React from 'react';
import { Link, Navigate } from 'react-router-dom'; // Added Navigate for redirection
import { useAuth } from '../contexts/AuthContext';

const FeatureCard: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="text-4xl mb-4 text-indigo-600">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HomePage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">PayMenu: Global Payments, Simplified</h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Send and receive money worldwide with ease. Get your virtual Visa or Mastercard instantly. Secure, fast, and reliable.
          </p>
          <div className="space-x-0 md:space-x-4 space-y-4 md:space-y-0 animate-fade-in-up delay-400">
            <Link
              to="/signup"
              className="inline-block w-full md:w-auto bg-white hover:bg-gray-100 text-indigo-600 font-semibold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block w-full md:w-auto bg-transparent hover:bg-indigo-500 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Why Choose PayMenu?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon="💸"
              title="Easy Money Transfers"
              description="Send funds across borders with competitive rates and lightning speed. Your money, where you want it, when you want it."
            />
            <FeatureCard
              icon="💳"
              title="Instant Virtual Cards"
              description="Get a virtual Visa or Mastercard upon KYC verification. Perfect for online shopping and subscriptions worldwide."
            />
            <FeatureCard
              icon="🌍"
              title="Global Direct Deposits"
              description="Receive payments and direct deposits from anywhere in the world directly into your PayMenu account."
            />
            <FeatureCard
              icon="🔒"
              title="Bank-Grade Security"
              description="Your financial security is our top priority. We use advanced encryption and security protocols to protect your data."
            />
            <FeatureCard
              icon="📱"
              title="User-Friendly Interface"
              description="Our app is designed for simplicity and ease of use, making managing your finances a breeze."
            />
            <FeatureCard
              icon="💡"
              title="Transparent Fees"
              description="No hidden charges. We believe in clear and upfront pricing for all our services."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Join thousands of users enjoying seamless global payments with PayMenu. Sign up today and experience the future of finance.
          </p>
          <Link
            to="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-lg text-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            Sign Up For Free
          </Link>
        </div>
      </section>

      {/* Basic CSS for animations (could be in index.css or App.css) */}
      {/* For simplicity, keeping it here. Ideally, move to a global CSS file. */}
      <style>{`
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
