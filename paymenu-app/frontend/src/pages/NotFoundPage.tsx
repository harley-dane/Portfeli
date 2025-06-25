import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
