// Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { setActiveMenu } from '../../features/menuSlice';
import { businessOwnerLinks, superAdminLinks ,managerLinks } from '../../data/Links';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';



const Sidebar = () => {
  const { businessOwner, superAdmin } = useAuth();
  const { isActiveMenu, themeColor } = useTheme();
  const dispatch = useDispatch();
  const isBusinessOwner = businessOwner.isAuthenticated
  const isSuperAdmin = superAdmin.isAuthenticated
  console.log("isBusinessOwner from sidebar ", isBusinessOwner);
  console.log("isSuperAdmin from sidebar ", isSuperAdmin);
  
  const links = isSuperAdmin ? superAdminLinks :isBusinessOwner ? businessOwnerLinks :   [];



  const handleMenuToggle = () => { dispatch(setActiveMenu(!isActiveMenu)); };

  return (
    <div>
      {/* Menu Toggle Button */}
      <button
        onClick={handleMenuToggle}
        className="p-4 text-gray-800 md:hidden"
        style={{ backgroundColor: themeColor }}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full transition-all duration-300 z-40 ${isActiveMenu ? 'w-64 bg-gray-100 shadow-lg' : 'w-0'} overflow-hidden`}>
        {isActiveMenu && (
          <div className="h-full flex flex-col">
            {/* Logo Section */}
            <div className="flex justify-between items-center p-4">
              <NavLink
                to={`/${isBusinessOwner ? 'business-owner' : 'super-admin'}/dashboard`}
                className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-gray-800"
              >
                {isBusinessOwner ? 'Business Owner' : isSuperAdmin ? 'Super Admin' : 'Manager'}
              </NavLink>
            </div>

            {/* Menu Links */}
            <div className="flex-grow overflow-y-auto">
              {links.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.route}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ease-in-out
                    ${isActive ? 'font-bold shadow-lg' : 'text-gray-800'}
                    ${isActive ? 'bg-opacity-100' : 'bg-transparent'}`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? themeColor : 'transparent',
                    color: isActive ? 'white' : themeColor,
                  })}
                >
                  <i className={`${item.icon} text-xl`} style={{ lineHeight: '1.5' }}></i>
                  <span className="text-lg align-middle" style={{ lineHeight: '1.5' }}>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {isActiveMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleMenuToggle}
        />
      )}
    </div>
  );
};

export default Sidebar;
