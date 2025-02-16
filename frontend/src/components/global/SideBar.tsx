import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { setActiveMenu } from '../../redux/slices/menuSlice';
import { businessOwnerLinks, superAdminLinks, managerLinks, employeeLinks, teamLeedLinks } from '../../utils/centralPaths';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import imgae from "../../images/images"

interface Role {
  isAuthenticated: boolean;
}

const Sidebar = () => {
  const { businessOwner, superAdmin, manager, employee } = useAuth();
  const { isActiveMenu, themeColor, themeMode } = useTheme();
  const dispatch = useDispatch();
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const isAuthenticated = (role: Role) => role.isAuthenticated;
  const links = isAuthenticated(superAdmin)
    ? superAdminLinks
    : isAuthenticated(businessOwner)
    ? businessOwnerLinks
    : isAuthenticated(manager)
    ? managerLinks
    : isAuthenticated(employee) && employee.position !== 'Team Lead'
    ? employeeLinks
    : isAuthenticated(employee) && employee.position === 'Team Lead'
    ? teamLeedLinks
    : [];

  const companyLogo = isAuthenticated(businessOwner)
    ? businessOwner.companyLogo || "https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png"
    : isAuthenticated(manager)
    ? manager.companyLogo || "https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png"
    : isAuthenticated(employee)
    ? employee.companyLogo || "https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png"
    : imgae.logoThird;

  const toggleMenu = () => dispatch(setActiveMenu(!isActiveMenu));
  const toggleSubMenu = (title: string) => setActiveSubMenu(activeSubMenu === title ? null : title);

  return (
    <div>
      {/* Toggle Button */}
      <button 
        onClick={toggleMenu} 
        className="p-4 text-gray-800 md:hidden hover:opacity-80 transition-opacity" 
        style={{ backgroundColor: themeColor }}
      >
        <FiMenu className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"  />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full transition-all ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} duration-300 z-40 ${isActiveMenu ? 'w-64 shadow-lg' : 'w-0'} overflow-hidden`}>
        {isActiveMenu && (
          <div className="h-full flex flex-col">
            {/* Logo Header */}
            <div className="flex justify-between items-center p-4 ">
              <NavLink
                to={`/${
                  isAuthenticated(businessOwner) ? 'business-owner/dashboard'
                  : isAuthenticated(superAdmin) ? 'super-admin/dashboard'
                  : isAuthenticated(manager) ? 'manager/dashboard'
                  : isAuthenticated(employee) && employee.position !== 'Team Lead' ? 'employee/dashboard'
                  : isAuthenticated(employee) && employee.position === 'Team Lead' ? 'employee/teamlead-dashboard'
                  : 'guest'
                }`}
                className="flex items-center space-x-3 group hover:opacity-90 transition-opacity"
              >
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-10 h-10 object-cover rounded-full shadow-md"
                />
                <span className={`font-bold text-lg truncate max-w-[180px] ${themeMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {isAuthenticated(businessOwner) ? businessOwner.companyName
                    : isAuthenticated(superAdmin) ? 'Super Admin'
                    : isAuthenticated(manager) ? manager.companyName
                    : isAuthenticated(employee) ? employee.companyName
                    : 'Guest'}
                </span>
              </NavLink>
            </div>

            {/* Navigation Links */}
            <div className="flex-grow overflow-y-auto py-2">
              {links.map((item, index) => (
                <div key={index} className="px-3 py-1">
                  <NavLink
                    to={item.route}
                    className={({ isActive }) =>
                      `flex items-center gap-4 p-3 rounded-lg font-semibold transition-all duration-200
                      ${isActive ? 'shadow-md' : ''}
                      hover:shadow-lg hover:scale-[1.02] hover:brightness-110`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? themeColor : 'transparent',
                      color: isActive ? 'white' : themeColor,
                    })}
                    onClick={() => item.hasSubMenu && toggleSubMenu(item.title)}
                  >
                    <i className={`${item.icon} text-xl flex-shrink-0`}></i>
                    <span className="flex-grow">{item.title}</span>
                    {item.hasSubMenu && (
                      <span className="flex-shrink-0">
                        {activeSubMenu === item.title ? <FiChevronUp className="w-5 h-5 sm:w-6 sm:h-6"  /> : <FiChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </span>
                    )}
                  </NavLink>

                  {/* Submenu */}
                  {item.hasSubMenu && activeSubMenu === item.title && (
                    <div className="pl-6 mt-1 space-y-1">
                      {item.subLinks?.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.route}
                          className={({ isActive }) =>
                            `flex items-center gap-4 p-3 rounded-lg font-medium transition-all duration-200 
                            ${isActive ? 'shadow-md' : ''}
                            hover:shadow-lg hover:scale-[1.02] hover:brightness-110`
                          }
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? themeColor : 'transparent',
                            color: isActive ? 'white' : themeColor,
                          })}
                        >
                          <i className={`${subItem.icon} text-xl flex-shrink-0`}></i>
                          <span className="flex-grow">{subItem.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isActiveMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;