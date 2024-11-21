import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"
import {PrivateRouteProps} from "../utils/interfaces"


const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { businessOwner, superAdmin,manager } = useAuth();
  const isSuperAdmin = superAdmin.isAuthenticated
  const isBusinessOwner = businessOwner.isAuthenticated
  const isManager = manager.isAuthenticated
  console.log("isSuperAdmin : ",isSuperAdmin)

  if (isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" />;
  } else if (isBusinessOwner) {
    return <Navigate to="/business-owner/dashboard" />;
  } else if (isManager) {
    return <Navigate to="/manager/dashboard" />;
  }else{
  return <>{children}</>;
  }

};

export default PrivateRoute;
