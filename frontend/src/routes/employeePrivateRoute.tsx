import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';



const EmployeePrivateRoute: React.FC = () => {
  const{employee}= useAuth()
  console.log("employee-isauthenticated",employee.isAuthenticated)
  console.log("employee-position is",employee.position)
  if (!employee.isAuthenticated) {
    return <Navigate to="/employee-login" />;
  }

  return <Outlet />;
};

export default EmployeePrivateRoute;
