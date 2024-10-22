import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { FaChartPie, FaBuilding, FaClipboardList, FaServicestack, FaUsers, FaCog, FaBoxOpen, FaMoneyBillWave, FaComments, FaBell, FaQuestionCircle } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { setActiveMenu } from '../../features/menuSlice';
import nexiumLogo from '../../assets/landingPageAssets/NavbarLogo.png'; // Adjust the path according to your structure
import { RootState } from '../../store/store';

interface LinkItem {
  title: string;
  route: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeMenuState = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);
  const userRole = useSelector((state: RootState) => state.businessOwner.role);

  // Create a route prefix based on user role
  const routePrefix = userRole 
  console.log("routePrefix:->", routePrefix);

  const links: LinkItem[] = [
    { title: 'Dashboard', route: `/${routePrefix}/dashboard`, icon: <FaChartPie /> },
    { title: 'Plans', route: `/${routePrefix}/plans`, icon: <FaClipboardList /> },
    { title: 'Services', route: `/${routePrefix}/services`, icon: <FaServicestack /> },
    { title: 'Users', route: userRole === 'workers' ? `/${routePrefix}/workers` : `/${routePrefix}/workers`, icon: <FaUsers /> },
    { title: 'Finance', route: `/${routePrefix}/finance`, icon: <FaMoneyBillWave /> },
    { title: 'Feedback', route: `/${routePrefix}/feedback`, icon: <FaComments /> },
    { title: 'Notifications', route: `/${routePrefix}/notifications`, icon: <FaBell /> },
    
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
      <FiMenu size={24} />
    </button>
  
    {/* Sidebar */}
    <div className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40 
      ${activeMenuState ? 'w-64 bg-gray-100 shadow-lg' : 'w-0'} overflow-auto`}
    >
      {activeMenuState && (
        <div className="h-full flex flex-col">
          
          {/* Logo Section */}
          <div className="flex justify-between items-center p-4">
            <NavLink
              to={`/${routePrefix}/dashboard`}
              className="items-center gap-3 flex text-xl font-extrabold tracking-tight text-gray-800"
            >
              {userRole}
            </NavLink>
          </div>
  
          {/* Menu Links */}
          <div className="flex-grow overflow-y-auto">
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
                })}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`text-lg ${activeMenuState ? 'block' : 'hidden md:block'}`}>
                  {item.title}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  
    {/* Overlay for closing the menu on small devices */}
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
