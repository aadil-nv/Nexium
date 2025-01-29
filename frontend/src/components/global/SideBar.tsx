import  { useState } from 'react';
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
  const { isActiveMenu, themeColor } = useTheme();
  const dispatch = useDispatch();
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const isAuthenticated = (role : Role) => role.isAuthenticated;
  const links = isAuthenticated(superAdmin)
    ? superAdminLinks
    : isAuthenticated(businessOwner)
    ? businessOwnerLinks
    : isAuthenticated(manager)
    ? managerLinks
    : isAuthenticated(employee)&& employee.position !== 'Team Lead'
    ? employeeLinks
    : isAuthenticated(employee)&& employee.position === 'Team Lead'
    ? teamLeedLinks
    : [];

    const companyLogo = isAuthenticated(businessOwner)
    ? businessOwner.companyLogo||"https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png"
    : isAuthenticated(manager)
    ? manager.companyLogo ||"https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png"
    : isAuthenticated(employee)
    ? employee.companyLogo ||"https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png"
    : imgae.logoThird

  const toggleMenu = () => dispatch(setActiveMenu(!isActiveMenu));
  const toggleSubMenu = (title: string) => setActiveSubMenu(activeSubMenu === title ? null : title);

  return (
    <div>
      {/* Toggle Button */}
      <button onClick={toggleMenu} className="p-4 text-gray-800 md:hidden" style={{ backgroundColor: themeColor }}>
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full transition-all duration-300 z-40 ${isActiveMenu ? 'w-64 bg-gray-100 shadow-lg' : 'w-0'} overflow-hidden`}>
        {isActiveMenu && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4">
            <NavLink
  to={`/${isAuthenticated(businessOwner) ? 'business-owner' : isAuthenticated(superAdmin) ? 'super-admin' : isAuthenticated(manager) ? 'manager' : 'employee'}/dashboard`}
  className="text-xl font-extrabold text-gray-800 flex items-center space-x-2" // Added flex for inline layout and space between logo and name
>
<img
  src={companyLogo}
  alt="Business Owner Logo"
  className="w-10 h-10 object-cover rounded-full" // Circular image styling
/>

  
  <span className="truncate max-w-[200px]">  {/* Truncate the company name if it's too long */}
    {isAuthenticated(businessOwner) ? businessOwner.companyName : isAuthenticated(superAdmin) ? 'Super Admin' : isAuthenticated(manager) ? manager.companyName : isAuthenticated(employee) ? employee.companyName : 'Guest'}
  </span>
</NavLink>

            </div>
            <div className="flex-grow overflow-y-auto">

          
              {links.map((item, index) => (
                <div key={index}>
                  <NavLink
                    to={item.route}
                    className={({ isActive }) =>
                      `flex items-center gap-4 p-3 rounded-lg ${isActive ? 'font-bold shadow-lg' : ''} hover:bg-gray-300 transition-all`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? themeColor : 'transparent',
                      color: isActive ? 'white' : themeColor,
                    })}
                    onClick={() => item.hasSubMenu && toggleSubMenu(item.title)}
                  >
                    <i className={`${item.icon} text-xl`}></i>
                    <span>{item.title}</span>
                    {item.hasSubMenu && (
                      <span className="ml-auto">
                        {activeSubMenu === item.title ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                      </span>
                    )}
                  </NavLink>
                  {item.hasSubMenu && activeSubMenu === item.title && (
                    <div className="pl-6">
                      {item.subLinks?.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.route}
                          className={({ isActive }) =>
                            `flex items-center gap-4 p-3 rounded-lg ${isActive ? 'font-bold shadow-lg' : ''} hover:bg-gray-300 transition-all`
                          }
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? themeColor : 'transparent',
                            color: isActive ? 'white' : themeColor,
                          })}
                        >
                          <i className={`${subItem.icon} text-xl`}></i>
                          <span>{subItem.title}</span>
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

      {isActiveMenu && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleMenu}></div>}
    </div>
  );
};

export default Sidebar;
