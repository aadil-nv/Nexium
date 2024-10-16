import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { FaChartPie, FaBuilding, FaClipboardList, FaServicestack, FaUsers, FaCog, FaBoxOpen, FaMoneyBillWave, FaComments, FaBell, FaQuestionCircle } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { setActiveMenu } from '../../features/menuSlice';

interface LinkItem {
  title: string;
  route: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeMenuState = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);
  const currentColor = useSelector((state: { menu: { themeColor: string, themeMode: boolean } }) => state.menu.themeColor);
  const userRole = useSelector((state: { menu: { userRole: string } }) => state.menu.userRole);

  // Dynamically update routes based on the user role
  const getRoutePrefix = (role: string) => {
    if (role === 'businessOwner') return '/businessOwner';
    if (role === 'super-admin') return '/super-admin';
    return '/';
  };

  const routePrefix = userRole

  // Dynamically define the links array based on the user role
  const links: LinkItem[] = [
    { title: 'Dashboard', route: `${routePrefix}/dashboard`, icon: <FaChartPie /> },
    { title: 'Companies', route: `${routePrefix}/companies`, icon: <FaBuilding /> },
    { title: 'Plans', route: `${routePrefix}/plans`, icon: <FaClipboardList /> },
    { title: 'Services', route: `${routePrefix}/services`, icon: <FaServicestack /> },
    { title: 'Users', route: userRole === 'businessOwner' ? `${routePrefix}/workers` : `${routePrefix}/users`, icon: <FaUsers /> },
    { title: 'Inventory', route: `${routePrefix}/inventory`, icon: <FaBoxOpen /> },
    { title: 'Finance', route: `${routePrefix}/finance`, icon: <FaMoneyBillWave /> },
    { title: 'Feedback', route: `${routePrefix}/feedback`, icon: <FaComments /> },
    { title: 'Notifications', route: `${routePrefix}/notifications`, icon: <FaBell /> },
    { title: 'Settings', route: `${routePrefix}/settings`, icon: <FaCog /> },
    { title: 'Help', route: `${routePrefix}/help`, icon: <FaQuestionCircle /> },
  ];

  const handleMenuToggle = () => {
    dispatch(setActiveMenu(!activeMenuState));
  };

  return (
    <div>
      <button
        onClick={handleMenuToggle}
        className="p-4 text-gray-800 md:hidden"
        style={{ backgroundColor: currentColor }}
      >
        <FiMenu size={28} />
      </button>

      <div className={`fixed top-0 left-0 h-screen overflow-hidden transition-all duration-300 z-40 
        ${activeMenuState ? 'w-64 bg-gray-100 shadow-lg' : 'w-0'}`}
      >
        {activeMenuState && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4">
             
              <NavLink
                to={`${routePrefix}/dashboard`}
                className="items-center gap-3 flex text-xl font-extrabold tracking-tight text-gray-800"
              >
                {userRole}
              </NavLink>
            </div>

            {/* Scrollable Links Container */}
            <div className="mt-4 overflow-y-auto scrollbar-hide flex-grow">
              {links.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.route}
                  className={({ isActive }) =>
                    `flex items-center gap-4 mb-5 p-3 rounded-lg transition-colors duration-200 
                     ${isActive ? 'text-white font-bold shadow-md' : 'text-gray-800'}`}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? currentColor : 'transparent',
                    transition: 'background-color 0.2s',
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('font-bold')) {
                      e.currentTarget.style.backgroundColor = currentColor; // Set hover color
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('font-bold')) {
                      e.currentTarget.style.backgroundColor = 'transparent'; // Reset hover color
                    }
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-base ${activeMenuState ? 'block' : 'hidden md:block'}`}>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {activeMenuState && (
        <div
          className="fixed inset-0 opacity-50 z-30 md:hidden"
          style={{ backgroundColor: currentColor }}
          onClick={handleMenuToggle}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
