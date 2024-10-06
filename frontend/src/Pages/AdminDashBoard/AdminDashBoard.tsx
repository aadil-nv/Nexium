import React from "react";
import Sidebar from "../../Components/AdminDashboard/SideBar";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Navbar from "../../Components/AdminDashboard/Navbar";
import Footer from "../../Components/AdminDashboard/Footer"; // Consider using this in the layout
import ThemeSettings from "../../Components/AdminDashboard/ThemeSettings"; // Consider adding this where needed

const AdminDashBoard = () => {
  const activeMenu = true;

  return (
    <>
      {/* Sidebar */}
      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
          activeMenu ? "md:ml-72" : "flex-2"
        }`}
      >
        {/* Navbar */}
        <div className="fixed top-0 bg-main-bg dark:bg-main-dark-bg navbar w-full z-50">
          <Navbar />
        </div>

        <div className="pt-16"> 
          {/* Add main content here */}
        </div>

        {/* Settings Button */}
        <div className="fixed right-4 bottom-4 z-50">
          <TooltipComponent content="Settings" position="TopCenter">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white rounded-full"
              style={{ background: "blue" }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
      </div>
    </>
  );
};

export default AdminDashBoard;
