import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface SuperAdminPrivateRouteProps {
  children: React.ReactNode;
}

const SuperAdminPrivateRoute = ({ children }: SuperAdminPrivateRouteProps) => {
  const{superAdmin}= useAuth()
  const isAuthenticated = superAdmin?.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to="/superadmin-login" />;
  }

  return <>{children}</>;
};

export default SuperAdminPrivateRoute;