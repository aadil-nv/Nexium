import React, { useState } from "react";
import logo from "../../../assets/landingPageAssets/adhil_logo_PNG[1].png";
import { IoMenu } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { ModeToggle } from "../../ui/mode-toggle";
import { useTheme } from "../landingPage/theme-provider";
import { Link, useLocation } from "react-router-dom"; // Import useLocation here

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const { theme } = useTheme(); // Get the current theme
  const location = useLocation(); // Get the current location

  const navItems = [
    { link: "Home", path: "/" },
    { link: "About", path: "/about" },
    { link: "Services", path: "/services" },
    { link: "Contact", path: "/contact" },
  ];

  // Determine the button link and text based on the current path
  const isSignup = location.pathname === "/signup"; // Check if current path is "/signup"
  const isHome = location.pathname === "/"; // Check if current path is "/"

  // Button styles
  const buttonStyle =
    "flex items-center justify-center w-24 h-10 text-center font-bold rounded transform transition-transform duration-300 hover:scale-105 active:scale-95 text-sm"; // Ensures text is centered

  return (
    <nav
      className={`sticky top-0 z-50 p-4 max-w-screen-2xl mx-auto ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-primary"
      } shadow`}
    >
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
            <Link
              key={link}
              to={path}
              className={`block hover:text-gray-300 ${
                theme === "dark" ? "hover:text-gray-400" : ""
              }`}
            >
              {link}
            </Link>
          ))}
        </ul>

        {/* Right: Login and Sign Up */}
        <div className="hidden md:flex items-center space-x-4"> {/* Reduced space between buttons */}
          {isHome ? (
            <>
              <Link
                to="/login"
                className={`${buttonStyle} bg-blue-600 hover:bg-blue-700 text-white`} // Login button style
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`${buttonStyle} bg-transparent border border-blue-600 hover:bg-blue-600 hover:text-white ${
                  theme === "dark" ? "text-gray-300" : "text-blue-600"
                }`} // Transparent Sign Up button style with dark mode text color
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              to={isSignup ? "/login" : "/signup"}
              className={`${buttonStyle} bg-blue-600 hover:bg-blue-700 text-white`}
            >
              {isSignup ? "Login" : "Sign Up"}
            </Link>
          )}
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <button onClick={toggleMenu} className="text-primary focus:outline-none">
            {isMenuOpen ? (
              <FaXmark className="w-6 h-6" />
            ) : (
              <IoMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`mt-4 space-y-2 ${
            theme === "dark" ? "bg-black-900 text-white" : "bg-white text-primary"
          } p-4 rounded-lg`}
        >
          {/* Mobile Menu Items */}
          {navItems.map(({ link, path }) => (
            <Link
              key={link}
              to={path}
              className={`block text-lg hover:text-gray-500 ${
                theme === "dark" ? "hover:text-gray-400" : ""
              }`}
            >
              {link}
            </Link>
          ))}

          <Link
            to="/login"
            className={`${buttonStyle} bg-blue-600 hover:bg-blue-700 text-white`} // Login button style for mobile
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`${buttonStyle} bg-transparent border border-green-600 hover:bg-green-600 hover:text-white text-green-600`} // Transparent Sign Up button style for mobile
          >
            Sign Up
          </Link>
          <div className="flex items-center justify-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
