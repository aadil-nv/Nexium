import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdNotificationsNone } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';
import { Alert } from "antd";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import NotificationMenu from "./NotificationMenu";
import DropdownMenu from "./DropDown";
import { handleLogout, handleProfileClick, onSettingsClick, NavButton, toggleMenu } from "../../utils/navbarFunctions";
import images from "../../images/images";
import socket from '../../config/socket';
import { communicationInstance } from '../../services/communicationInstance';

interface INotification {
  _id: string;
  message: string;
  title: string;
  type: string;
  description: string;
  read: boolean;
  createdAt?: string;
}

export default function Navbar(): JSX.Element {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const { businessOwner, superAdmin, manager, employee } = useAuth();
  const { isActiveMenu, themeColor } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

    socket.on('notification', (newNotification: INotification) => {
      toast.success(newNotification.message, {
        duration: 4000,
        position: 'top-right',
      });
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const fetchNotifications = async (): Promise<void> => {
    try {
      const response = await communicationInstance.get<INotification[]>("/communication-service/api/notification/get-all-notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notificationId: string): Promise<void> => {
    try {
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearNotification = async (notificationId: string): Promise<void> => {
    try {
      await communicationInstance.delete(`/communication-service/api/notification/delete-notification/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId)
      );
      toast.success("Notification removed");
    } catch (error) {
      console.error("Error removing notification:", error);
      toast.error("Failed to remove notification");
    }
  };

  const clearAllNotifications = async (): Promise<void> => {
    try {
      await communicationInstance.delete("/communication-service/api/notification/clear-all-notifications");
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const defaultProfileImage = "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png";

  console.log("Manager is 000=========>", manager);
  
  
  const userName = businessOwner.isAuthenticated ? businessOwner?.companyName :
    superAdmin.isAuthenticated ? "Super Admin" :
      manager.isAuthenticated ? manager?.managerName :
        employee.isAuthenticated ? employee?.employeeName : "Guest";

  const profileImage = businessOwner.isAuthenticated
    ? businessOwner.businessOwnerProfilePicture || defaultProfileImage
    : superAdmin.isAuthenticated
      ? images.superadmin
      : manager.isAuthenticated
        ? manager.managerProfilePicture || defaultProfileImage
        : employee.isAuthenticated
          ? employee.employeeProfilePicture || defaultProfileImage
          : defaultProfileImage;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleProfileClickWrapper = () => {
    handleProfileClick({
      isBusinessOwner: businessOwner,
      isSuperAdmin: superAdmin,
      isManager: manager,
      isEmployee: employee,
      dispatch,
      navigate
    });
  };

  const handleSettingsClickWrapper = () => {
    onSettingsClick({
      isBusinessOwner: businessOwner,
      isSuperAdmin: superAdmin,
      isManager: manager,
      isEmployee: employee,
      dispatch,
      navigate
    });
  };

  const handleLogoutWrapper = () => {
    handleLogout({isBusinessOwner: businessOwner,isSuperAdmin: superAdmin,isManager: manager,isEmployee: employee,dispatch,navigate});
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-between p-2 h-16 bg-white shadow-sm fixed top-0 z-40 ${
        isActiveMenu ? "w-[calc(100%-250px)]" : "w-full"
      }`}
    >
      <NavButton
        customFunc={() => toggleMenu(dispatch, isActiveMenu)}
        icon={<span>☰</span>}
        themeColor={themeColor}
      />
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center justify-center relative"
            style={{
              background: `${themeColor}10`,
              padding: "8px",
              borderRadius: "12px",
              color: themeColor,
            }}
          >
            <MdNotificationsNone size={24} />
            {unreadCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs text-white rounded-full"
                style={{ backgroundColor: themeColor }}
              >
                {unreadCount}
              </span>
            )}
          </motion.button>

          <NotificationMenu 
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onClearNotification={clearNotification}
            onClearAll={clearAllNotifications}
            themeColor={themeColor}
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <motion.div 
          className="relative"
          whileHover={{ scale: 1.02 }}
        >
          <motion.button
            type="button"
            className="flex items-center gap-3 p-2 rounded-lg"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ backgroundColor: `${themeColor}10` }}
            whileHover={{ backgroundColor: `${themeColor}20` }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.img
              src={profileImage}
              alt="Profile"
              className="rounded-full w-8 h-8 md:w-9 md:h-9 object-cover border-2"
              style={{ borderColor: themeColor }}
              whileHover={{ scale: 1.1 }}
            />
            <span className="hidden sm:inline text-sm font-medium" style={{ color: themeColor }}>
              {userName}
            </span>
            <motion.div
              animate={{ rotate: showProfileMenu ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
               <DropdownMenu
  themeColor={themeColor}
  onProfileClick={handleProfileClickWrapper}
  onSettingsClick={handleSettingsClickWrapper}
  onLogoutClick={() => setShowLogoutConfirm(true)}
  onOptionSelect={() => setShowProfileMenu(false)} // Add this line
/>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
  {showLogoutConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed left-0 top-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        margin: '0',
        padding: '0'
      }}
      onClick={() => setShowLogoutConfirm(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-4 m-4 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Alert
          message="Confirm Logout"
          style={{backgroundColor:"white"}}
          description={
            <div className="mt-2">
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: themeColor }}
                  onClick={handleLogoutWrapper}
                >
                  Logout
                </motion.button>
              </div>
            </div>
          }
          type="warning"
          showIcon
          className="border-none shadow-none"
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </motion.div>
  );
}