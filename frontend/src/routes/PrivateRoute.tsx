import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"
import {PrivateRouteProps} from "../utils/interfaces"


const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { businessOwner, superAdmin,manager,employee } = useAuth();
  const isSuperAdmin = superAdmin.isAuthenticated
  const isBusinessOwner = businessOwner.isAuthenticated
  const isManager = manager.isAuthenticated
  const isEmployee = employee.isAuthenticated
  console.log("isSuperAdmin :==> ",isSuperAdmin)
  console.log("isManager :==> ",isManager)
  console.log("isEmployee :==> ",isEmployee)
  console.log("isBusinessOwner :==> ",isBusinessOwner)
  console.log("isTeamLead :==> ", employee.position == "Team Lead")
  

  if (isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" />;
  } else if (isBusinessOwner) {
    return <Navigate to="/business-owner/dashboard" />;
  } else if (isManager) {
    console.log("manager hited from privatrout ********************************************************************** ",)
    return <Navigate to="/manager/dashboard" />;
  }else if (isEmployee &&employee.position !== "Team Lead") {
    return <Navigate to="/employee/dashboard" />;
  } else if (isEmployee && employee.position == "Team Lead") {
    return <Navigate to="/employee/teamlead-dashboard" />;
  }else{
    return <>{children}</>;
  }

};

export default PrivateRoute;
