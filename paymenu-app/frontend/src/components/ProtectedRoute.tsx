import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  // children?: React.ReactNode; // Outlet handles children for nested routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { user, isLoading, token } = useAuth();

  if (isLoading) {
    return <div>Loading authentication status...</div>; // Or a spinner component
  }

  // Check for token presence as well, user object might be delayed by profile fetch
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // If user is loaded and token exists, allow access
  if (user && token) {
      return <Outlet />; // Renders the child route's element
  }

  // Fallback if still loading or in an inconsistent state, might redirect to login
  // This case should ideally be covered by isLoading or the checks above.
  // If token is present but user is not (e.g. profile fetch failed and cleared user), redirect.
  if (token && !user) {
    // This could happen if profile fetch fails and user is set to null by AuthProvider
    // But token might still be in localStorage. Redirecting to login is safer.
    return <Navigate to="/login" replace />;
  }

  // Default case if none of the above matched (should not happen with proper logic)
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
