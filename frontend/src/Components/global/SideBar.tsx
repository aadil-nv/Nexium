// Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux';
import { setActiveMenu } from '../../features/menuSlice';
import { RootState } from '../../store/store';
import { businessOwnerLinks, superAdminLinks } from '../../data/Links'; // Import the links

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeMenuState = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);
  const isBusinessOwner = useSelector((state: RootState) => state.businessOwner.role === 'business-owner');
  const isSuperAdmin = useSelector((state: RootState) => state.superAdmin.role === 'super-admin');

  // Determine which links to use based on user role
  const links = isBusinessOwner ? businessOwnerLinks : isSuperAdmin ? superAdminLinks : [];

  const handleMenuToggle = () => {
    dispatch(setActiveMenu(!activeMenuState));
  };

  return (
    <div>
      {/* Menu Toggle Button */}
      <button
        onClick={handleMenuToggle}
        className="p-4 text-gray-800 md:hidden"
        style={{ backgroundColor: currentColor }}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full transition-all duration-300 z-40 ${activeMenuState ? 'w-64 bg-gray-100 shadow-lg' : 'w-0'} overflow-hidden`}>
        {activeMenuState && (
          <div className="h-full flex flex-col">
            {/* Logo Section */}
            <div className="flex justify-between items-center p-4">
              <NavLink
                to={`/${isBusinessOwner ? 'business-owner' : 'super-admin'}/dashboard`}
                className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-gray-800"
              >
                {isBusinessOwner ? 'Business Owner' : 'Super Admin'}
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
                    ${isActive ? 'bg-opacity-100' : 'bg-transparent'}` // Keep background transparent when not active
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? currentColor : 'transparent', // Use current color for active background
                    color: isActive ? 'white' : currentColor, // Text color for active state
                  })}
                >
                  {/* Custom Icon with class name, centered vertically */}
                  <i className={`${item.icon} text-xl`} style={{ lineHeight: '1.5' }}></i>
                  <span className="text-lg align-middle" style={{ lineHeight: '1.5' }}>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for small devices */}
      {activeMenuState && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleMenuToggle}
        />
      )}
    </div>
  );
};

export default Sidebar;
