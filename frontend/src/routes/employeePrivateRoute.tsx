import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface EmployeePrivateRouteProps {
  children: React.ReactNode;
}

const EmployeePrivateRoute = ({ children }: EmployeePrivateRouteProps) => {
  const{employee}= useAuth()

  if (!employee.isAuthenticated) {
    return <Navigate to="/employee-login" />;
  }

  return <>{children}</>;
};

export default EmployeePrivateRoute;
