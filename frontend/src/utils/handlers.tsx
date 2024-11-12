// handleLogout.js
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { logout as superAdminLogout } from "../features/superAdminSlice";
import { logout as businessOwnerLogout } from "../features/businessOwnerSlice";

export  function handleLogout({ businessOwner, superAdmin, dispatch, navigate, setShowLogoutConfirm }) {

  return async () => {
    try {
      
      await axios.post("/api/auth/logout");

      setShowLogoutConfirm(false);
      if (businessOwner.isAuthenticated) {
        dispatch(businessOwnerLogout());
        navigate("/login");
      } else if (superAdmin.isAuthenticated) {
        dispatch(superAdminLogout());
        navigate("/superadmin-login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
}
