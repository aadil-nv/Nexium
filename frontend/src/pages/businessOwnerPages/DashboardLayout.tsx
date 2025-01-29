import  { useState } from 'react';
import { Outlet } from 'react-router-dom'; // This will render the child routes
import Sidebar from '../../components/global/SideBar';
import Navbar from '../../components/global/Navbar';
import { useSelector } from 'react-redux';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import ThemeSettings from '../../components/global/ThemeSettings'; // Assuming you have this component

const DashBoardLayout = () => {
  const activeMenu = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  const toggleThemeSettings = () => {
    setShowThemeSettings((prev) => !prev);
  };

  return (
    <div className="flex z-1000">
      {/* Sidebar */}
      <div
        className={`fixed h-screen bg-gray-800 text-white z-30 transition-all duration-300 
        ${activeMenu ? 'w-64' : 'w-0'}`} // Adjust width as needed
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 
        ${activeMenu ? 'ml-64' : 'ml-0'} overflow-hidden`}>
        
        {/* Navbar */}
        <div className="w-full z-50">
          <Navbar />
        </div>

        {/* Page Content (Admin Pages) */}
        <div className="p-4 mt-16 overflow-y-auto h-[calc(100vh-64px)]"> {/* Adjust height as necessary */}
          <Outlet /> {/* This will render the current route's component */}
        </div>

        {/* Settings Button */}
        <div className="fixed right-4 bottom-4 z-50">
          <TooltipComponent content="Settings" position="TopCenter">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl bg-blue-500 text-white rounded-full"
              onClick={toggleThemeSettings} // Toggle the ThemeSettings visibility
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>

        {/* Conditionally render the ThemeSettings component */}
        {showThemeSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <ThemeSettings onClose={toggleThemeSettings} /> {/* Add an onClose prop to handle closing */}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoardLayout; // Export the CompanyLayout
