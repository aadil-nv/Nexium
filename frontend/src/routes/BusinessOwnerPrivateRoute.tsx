import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const BusinessOwnerPrivateRoute: React.FC = () => {
  const { businessOwner } = useAuth();

  if (!businessOwner.isAuthenticated ) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default BusinessOwnerPrivateRoute;
