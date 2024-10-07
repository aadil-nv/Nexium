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

const links: LinkItem[] = [
  { title: 'Dashboard', route: '/dashboard', icon: <FaChartPie /> },
  { title: 'Companies', route: '/companies', icon: <FaBuilding /> },
  { title: 'Plans', route: '/plans', icon: <FaClipboardList /> },
  { title: 'Services', route: '/services', icon: <FaServicestack /> },
  { title: 'Users', route: '/users', icon: <FaUsers /> },
  { title: 'Inventory', route: '/inventory', icon: <FaBoxOpen /> }, 
  { title: 'Finance', route: '/finance', icon: <FaMoneyBillWave /> }, 
  { title: 'Feedback', route: '/feedback', icon: <FaComments /> }, 
  { title: 'Notifications', route: '/notifications', icon: <FaBell /> }, 
  { title: 'Settings', route: '/settings', icon: <FaCog /> },
  { title: 'Help', route: '/help', icon: <FaQuestionCircle /> },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeMenuState = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);

  const handleMenuToggle = () => {
    dispatch(setActiveMenu(!activeMenuState));
  };

  return (
    <div className={`fixed top-0 left-0 h-screen overflow-hidden transition-all duration-300 z-40 
        ${activeMenuState ? 'w-64 bg-gray-100 shadow-lg' : 'w-0'}`}
    >
      {activeMenuState && (
        <div className="h-full">
          <div className="flex justify-between items-center p-4">
            <NavLink 
              to="/super-admin" 
              className="items-center gap-3 flex text-xl font-extrabold tracking-tight text-gray-800"
            >
              Admin Dashboard
            </NavLink>

            <TooltipComponent content="Menu" position="BottomCenter">
              <button 
                onClick={handleMenuToggle} 
                className="text-xl rounded-full p-2 hover:bg-gray-200 transition duration-200 text-black"
              > 
                <FiMenu />
              </button>
            </TooltipComponent>
          </div>

          <div className='mt-4'>
            {links.map((item, index) => (
              <NavLink 
                key={index} 
                to={item.route} 
                className={({ isActive }) => 
                  `flex items-center gap-5 mb-5 ml-3 p-3 rounded-lg transition-colors duration-200 
                   ${isActive ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-gray-800 hover:bg-blue-700 hover:text-white'}` 
                }
              >
                {item.icon}
                <span className='hidden md:block'>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
