import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CapybaraLoader from './CapybaraLoader';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <CapybaraLoader message="Verifying campus authentication..." />
      </div>
    );
  }

  // If user is not logged in, redirect to /login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based permission
  if (allowedRole && user.role !== allowedRole) {
    // If student tries to access organizer-dashboard, redirect to /student-dashboard
    if (user.role === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    }
    // If organizer tries to access student-dashboard, redirect to /organizer-dashboard
    if (user.role === 'organizer') {
      return <Navigate to="/organizer-dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
