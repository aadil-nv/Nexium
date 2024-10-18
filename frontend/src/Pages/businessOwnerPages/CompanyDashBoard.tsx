import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // This will render the child routes
import Sidebar from '../../components/global/SideBar';
import Navbar from '../../components/global/Navbar';
import { useSelector } from 'react-redux';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import ThemeSettings from '../../components/global/ThemeSettings'; // Assuming you have this component

const companyLayout = () => {
  const activeMenu = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);

  const [showThemeSettings, setShowThemeSettings] = useState(false);


  const toggleThemeSettings = () => {
    setShowThemeSettings((prev) => !prev);
  };

  return (
    <div className="flex">
      
      <div
        className={`fixed h-screen bg-gray-800 text-white z-50 transition-all duration-300 
        ${activeMenu ? 'w-64' : 'w-0 overflow-hidden'}`}
      >
        <Sidebar />
      </div>

     
      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 
        ${activeMenu ? 'ml-64' : 'ml-0'}`}>
        
        
        <div className="w-full z-50">
          <Navbar />
        </div>

    
        <div className="p-4 mt-16">
          <Outlet />
        </div>

     
        <div className="fixed right-4 bottom-4 z-50">
          <TooltipComponent content="Settings" position="TopCenter">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl bg-blue-500 text-white rounded-full"
              onClick={toggleThemeSettings} 
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>

       
        {showThemeSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <ThemeSettings onClose={toggleThemeSettings} />
          </div>
        )}
      </div>
    </div>
  );
};

export default companyLayout; // Export the AdminLayout;
