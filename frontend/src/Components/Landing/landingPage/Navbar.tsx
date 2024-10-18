import React, { useState } from "react";
import logo from "../../../assets/landingPageAssets/NavbarLogo.png";
import { IoMenu } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { ModeToggle } from "../../ui/mode-toggle";
import { useTheme } from "../../landing/landingPage/theme-provider";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const { theme } = useTheme();
  const location = useLocation();

  const navItems = [
    { link: "Home", path: "/" },
    { link: "About", path: "/about" },
    { link: "Services", path: "/services" },
    { link: "Contact", path: "/contact" },
  ];

  const isSignup = location.pathname === "/signup";
  const isHome = location.pathname === "/";

  const buttonStyle =
    "flex items-center justify-center w-24 h-10 text-center font-bold rounded transform transition-transform duration-300 hover:scale-105 active:scale-95 text-sm";

  return (
    <nav
      className={`sticky top-0 z-50 p-4 max-w-screen-2xl mx-auto ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-primary"
      } shadow`}
    >
      <div className="text-lg container mx-auto flex items-center font-medium">
        {/* Left: Logo */}
        <div className="flex items-center">
          <a href="/">
            <img
              src={logo}
              alt="Nexium_logo"
              className="w-24 h-auto max-w-full max-h-16 object-contain"
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
        <div className="hidden md:flex items-center space-x-4">
          {isHome ? (
            <>
              <Link
                to="/login"
                className={`${buttonStyle} bg-blue-600 hover:bg-blue-700 text-white`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`${buttonStyle} bg-transparent border border-blue-600 hover:bg-blue-600 hover:text-white ${
                  theme === "dark" ? "text-gray-300" : "text-blue-600"
                }`}
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
        </div>

        {/* Dark Mode Toggle on Right */}
        <div className="ml-4 hidden md:flex items-center"> {/* Add some left margin for spacing */}
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto flex items-center">
        <div >
            <ModeToggle />
          </div>
          <button onClick={toggleMenu} className="text-primary focus:outline-none">
            {isMenuOpen ? (
              <FaXmark className="w-6 h-6" />
            ) : (
              <IoMenu className="w-6 h-6" />
            )}
          </button>
          {/* Dark Mode Toggle for Mobile */}
          
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
            className={`${buttonStyle} bg-blue-600 hover:bg-blue-700 text-white`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`${buttonStyle} bg-transparent border border-green-600 hover:bg-green-600 hover:text-white text-green-600`}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
