import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { FaChartPie, FaBuilding, FaClipboardList, FaServicestack, FaUsers, FaCog, FaFileAlt, FaBoxOpen, FaMoneyBillWave, FaComments, FaBell, FaQuestionCircle } from "react-icons/fa"; // Import appropriate icons

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

const Sidebar: React.FC = () => {
  const activeMenu = true;

  return (
    <div className='w-64 h-screen fixed top-0 left-0 overflow-auto bg-gray-100 shadow-lg transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
      {activeMenu && (
        <>
          <div className="flex justify-between items-center p-4">
            <NavLink 
              to="/dashboard" 
              className="items-center gap-3 flex text-xl font-extrabold tracking-tight text-gray-800"
            >
              <span>Admin Dashboard</span>
            </NavLink>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button 
                onClick={() => {}} 
                className="text-xl rounded-full p-2 bg-black-100 hover:bg-gray-200 transition duration-200 text-black"
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
                   ${isActive ? 'bg-blue-600 text-white font-bold shadow-md transform scale-105' : 'text-gray-800 hover:bg-blue-700 hover:text-white'}` 
                }
              >
                {item.icon}
                <span className='hidden md:block'>{item.title}</span> {/* Hide text on small screens */}
              </NavLink>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
