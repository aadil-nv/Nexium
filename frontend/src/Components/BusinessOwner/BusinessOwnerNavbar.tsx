import React from 'react'
import { FaTachometerAlt, FaUsers, FaClipboardList, FaHeadset, FaCog, FaSignOutAlt, FaBullhorn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PNG  from '../../images/png'

const navItems = [
  {
    icon: <img src={PNG.Dashboard} alt="" className='w-8 h-8 hue-rotate-90' />, // Dashboard icon
    label: 'Dashboard',
    link: '/dashboard',
  },
  {
    icon: <img src={PNG.Employess} alt="" className='w-6 h-6 hue-rotate-90' />, // Employees icon
    label: 'Employees',
    link: '/employees',
  },
  {
    icon: <img src={PNG.Plan} alt="" className='w-6 h-6' />, // Plan icon
    label: 'Plan',
    link: '/plan',
  },
  {
    icon: <img src={PNG.CustomerCare} alt="" className='w-6 h-6' />, // Customer Care icon
    label: 'Customer Care',
    link: '/customer-care',
  },
  {
    icon: <img src={PNG.Settings} alt="Dashboard" className='w-6 h-6 ' />, // Settings icon
    label: 'Settings',
    link: '/settings',
  },
  {
    icon: <img src={PNG.Logout} alt="Dashboard" className='w-6 h-6' />, // Logout icon
    label: 'Logout',
    link: '/logout',
  },
  {
    icon: <img src={PNG.Announcement} alt="Dashboard" className='w-6 h-6' />, // Announcements icon
    label: 'Announcements',
    link: '/announcements',
  },
];
;
export default function BusinessOwnerNavbar() {
  return (
    <div className="mt-4 text-sm">
      <nav>
        <ul className="flex flex-col lg:flex-row lg:space-x-4"> {/* Horizontal layout on large screens */}
          {navItems.map((item, index) => (
            <li key={index} className="flex items-center justify-center lg:justify-start py-2"> {/* Center items on smaller screens */}
              <Link to={item.link} className="flex items-center flex-col lg:flex-row lg:gap-4"> {/* Icon above label on small screens */}
                <a href={item.link} className="flex flex-col items-center lg:flex-row lg:gap-2 text-blue-500"> {/* Vertical layout on small screens, horizontal on large */}
                  {item.icon} {/* Icon */}
                  <span className="mt-2 lg:mt-0 hidden lg:block"> {/* Show label only on large screens */}
                    {item.label}
                  </span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    
  );
}

  
