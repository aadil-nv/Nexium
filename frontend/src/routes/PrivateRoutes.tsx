import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute: React.FC = () => {
  const { businessOwner } = useAuth();
  const isAuthenticated = businessOwner?.isAuthenticated;
  const token = businessOwner?.token;

  // Check authentication and token directly
  if (!isAuthenticated ) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
