import React from "react";
import { businessOwnerInstance } from "../services/businessOwnerInstance";
import { superAdminInstance } from "../services/superAdminInstance";
import { managerInstance } from "../services/managerInstance";
import { setActiveMenu } from "../redux/slices/menuSlice";
import { logout as superAdminLogout } from "../redux/slices/superAdminSlice";
import { logout as businessOwnerLogout } from "../redux/slices/businessOwnerSlice";
import { logout as managerLogout } from "../redux/slices/managerSlice";
import { logout as employeeLogout } from "../redux/slices/employeeSlice";
import { NavbarFunctionsProps} from "../utils/interfaces"
import {persistor} from "../redux/store/store" 
import { resetTasks } from "../redux/slices/taskSlice";




export const handleLogout = ({
  isBusinessOwner,
  isSuperAdmin,
  isManager,
  isEmployee,
  dispatch,
  navigate,
}: NavbarFunctionsProps) => {
  if (isBusinessOwner.isAuthenticated) {
    dispatch(businessOwnerLogout());
    businessOwnerInstance.post("/businessOwner/api/business-owner/logout");
    navigate("/login");
  } else if (isSuperAdmin.isAuthenticated) {
    dispatch(superAdminLogout());
    superAdminInstance.post("/superAdmin/api/superadmin/logout");
    navigate("/superadmin-login");
  } else if (isManager.isAuthenticated) {
    dispatch(managerLogout());
    managerInstance.post("/manager/api/manager/logout");
    navigate("/manager-login");
  } else if (isEmployee.isAuthenticated) {
    // persistor.purge()
    dispatch(resetTasks());
    dispatch(employeeLogout());
    managerInstance.post("/manager/api/manager/logout");
    navigate("/employee-login");

  }
};


export const handleProfileClick = (
  { isBusinessOwner, isSuperAdmin, isManager, isEmployee, navigate }: NavbarFunctionsProps
) => {
  console.log("isBusinessOwner.isAuthenticated:", isBusinessOwner.isAuthenticated);
  console.log("isSuperAdmin.isAuthenticated:", isSuperAdmin.isAuthenticated);
  console.log("isManager.isAuthenticated:", isManager.isAuthenticated);
  console.log("isEmployee.isAuthenticated:", isEmployee.isAuthenticated);
  
  if (isBusinessOwner.isAuthenticated) {
    navigate("/business-owner/profile");
  } else if (isSuperAdmin.isAuthenticated) {
    navigate("/super-admin/profile");
  } else if (isManager.isAuthenticated) {
    navigate("/manager/profile");
  } else if (isEmployee.isAuthenticated) {
    navigate("/employee/profile");
  }
};

// Updated onSettingsClick function with typed parameters
export const onSettingsClick = (
  { isBusinessOwner, isSuperAdmin, isManager, isEmployee, navigate }: NavbarFunctionsProps
) => {
  if (isBusinessOwner.isAuthenticated) {
    navigate("/business-owner/settings");
  } else if (isSuperAdmin.isAuthenticated) {
    navigate("/super-admin/settings");
  } else if (isManager.isAuthenticated) {
    navigate("/manager/settings");
  } else if (isEmployee.isAuthenticated) {
    navigate("/employee/settings");
  }
};

export const NavButton = ({ title, customFunc, icon, themeColor }) => (
  <button
    type="button"
    onClick={customFunc}
    className="relative text-xl rounded-full p-1 transition-all duration-300 ease-in-out transform hover:scale-110"
    style={{ color: themeColor }}
  >
    {icon}
  </button>
);


export const toggleMenu = (dispatch, isActiveMenu) => {
  dispatch(setActiveMenu(!isActiveMenu));
};
