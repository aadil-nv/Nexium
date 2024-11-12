import { RootState } from "../store/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isSuperAdmin = useSelector(
    (state: RootState) => state.superAdmin.isAuthenticated
  );
  const isBusinessOwner = useSelector(
    (state: RootState) => state.businessOwner.isAuthenticated
  );
  console.log("isSuperAdmin : ",isSuperAdmin)

  if (isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" />;
  } else if (isBusinessOwner) {
    return <Navigate to="/business-owner/dashboard" />;
  } else {
    return <>{children}</>;
  }

  // <Navigate to="/login" />;
};

export default PrivateRoute;
