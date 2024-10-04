import React, { useState } from "react"; // Import React here
import logo from "../../assets/landingPageAssets/adhil_logo_PNG[1].png"
import { IoMenu } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { ModeToggle } from "../ui/mode-toggle";
import { useTheme } from "../landingPage/theme-provider"; 
import { Link } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const [showLogin,SetShowLogin] = useState(false)

  const { theme } = useTheme(); // Get the current theme

  const navItems = [
    { link: "Home", path: "/" },
    { link: "About", path: "about" },
    { link: "Services", path: "services" },
    { link: "Contact", path: "contact" },
  ];

  return (
    <nav className={`sticky top-0 z-50 p-4 max-w-screen-2xl mx-auto ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-primary'} shadow`}> {/* Updated bg color for dark mode */}
      <div className="text-lg container mx-auto flex items-center font-medium">
        {/* Left: Logo */}
        <div className="flex items-center">
          <a href="#">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-11 lg:h-11 object-contain"
            />
          </a>
        </div>

        {/* Center: navItems */}
        <ul className="hidden md:flex flex-1 justify-center space-x-12">
          {navItems.map(({ link, path }) => (
            <a
              key={link}
              href={path}
              className={`block hover:text-gray-300 ${theme === 'dark' ? 'hover:text-gray-400' : ''}`}
            >
              {link}
            </a>
          ))}
        </ul>

        {/* Right: Login and Sign Up */}
        <div className="hidden md:flex items-center space-x-6">
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transform transition-transform duration-300 hover:scale-105 active:scale-95 sm:text-sm md:text-base lg:text-lg" 
           onClick={()=>SetShowLogin(true)}>
            Login
          </button>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <button onClick={toggleMenu} className="text-primary focus:outline-none">
            {isMenuOpen ? <FaXmark className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        <div className={`mt-4 space-y-2 ${theme === 'dark' ? 'bg-black-900 text-white' : 'bg-white text-primary'} p-4 rounded-lg`}> {/* Updated bg color for mobile menu in dark mode */}
          {/* Mobile Menu Items */}
          {navItems.map(({ link, path }) => (
            <a key={link} href={path} className={`block text-lg hover:text-gray-500 ${theme === 'dark' ? 'hover:text-gray-400' : ''}`}>
              {link}
            </a>
          ))}

          {/* Sign Up, Login, and Dark Mode Toggle on the same line */}
          <div className="flex space-x-2 items-center">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transform transition-transform duration-300 hover:scale-105 active:scale-95">
              Login
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transform transition-transform duration-300 hover:scale-105 active:scale-95">
              Sign up
            </button>
            <div className="flex items-center justify-center">
              <ModeToggle  /> {/* Adjusted size for the ModeToggle */}
            </div>
          </div>
        </div>
      </div>
      {showLogin &&  
      <Link path="/login"></Link>}
    </nav>

    
  );
};

export default Navbar;
