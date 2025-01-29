import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ManagerPrivateRoute: React.FC = () => {
  const { manager } = useAuth();

  if (!manager.isAuthenticated ) {
    return <Navigate to="/manager-login" />;
  }

  return <Outlet />;
};

export default ManagerPrivateRoute;
