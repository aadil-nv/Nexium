import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { FaChartPie, FaBuilding, FaClipboardList, FaServicestack, FaUsers, FaCog, FaBoxOpen, FaMoneyBillWave, FaComments, FaBell, FaQuestionCircle } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { setActiveMenu } from '../../features/menuSlice';
import nexiumLogo from '../../assets/landingPageAssets/NavbarLogo.png'; // Adjust the path according to your structure

interface LinkItem {
  title: string;
  route: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeMenuState = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);
  const userRole = useSelector((state: { menu: { userRole: string } }) => state.menu.userRole);

  const getRoutePrefix = (role: string) => {
    if (role === 'business-owner') return '/business-owner';
    if (role === 'super-admin') return '/super-admin';
    return '/';
  };

  const routePrefix = userRole;

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
        style={{ backgroundColor: currentColor }} // Use theme color for button background
      >
        <FiMenu size={24} />
      </button>

      <div className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40 
        ${activeMenuState ? 'w-64 bg-gray-100 shadow-lg' : 'w-0'}`} // Keep the width fixed for web view
      >
        {activeMenuState && (
          <div className="h-full flex flex-col">
            {/* Logo Section */}
            <div className="flex justify-center items-center p-4">
              <img
                src={nexiumLogo} // Path to your logo
                alt="Nexium Logo"
                className="h-4 w-auto" // Adjust height as needed
              />
            </div>

            <div className="flex justify-between items-center p-4">
              <NavLink
                to={`${routePrefix}/dashboard`}
                className="items-center gap-3 flex text-xl font-extrabold tracking-tight text-gray-800"
              >
                {userRole}
              </NavLink>
            </div>

            <div className="flex-grow overflow-y-auto"> {/* Allow scrolling if content overflows */}
              {links.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.route}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-3 rounded-lg transform transition-all duration-300 ease-in-out
                     ${isActive ? 'text-white font-bold shadow-lg' : 'text-gray-800'} 
                     hover:scale-105 hover:bg-opacity-90 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 hover:text-white`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? currentColor : 'transparent',
                    color: isActive ? 'white' : currentColor,
                    transition: 'background-color 0.2s, color 0.2s',
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('font-bold')) {
                      e.currentTarget.style.backgroundColor = currentColor;
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('font-bold')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = currentColor;
                    }
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  {/* Show title based on screen size */}
                  <span className={`text-lg ${activeMenuState ? 'block' : 'hidden md:block'}`}>
                    {item.title}
                  </span>
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
