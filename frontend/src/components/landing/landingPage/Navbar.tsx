import  { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoMenu } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { ModeToggle } from "../../../components/ui/mode-toggle";
import { useTheme } from "../../../components/landing/landingPage/theme-provider";
// import images from "../../../images/images";
import NavbarLogo from "../../../assets/landingPageAssets/NavbarLogo.png"

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

  const buttonStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-primary"
      } shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 relative z-10"
          >
            <Link to="/" className="flex items-center">
              <img
                src={ NavbarLogo }
                alt="Logo"
                className="h-6 w-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1 px-4">
            {navItems.map(({ link, path }) => (
              <motion.div
                key={link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  to={path}
                  className="text-sm font-medium hover:text-blue-500 transition-colors relative
                    after:content-[''] after:absolute after:bottom-0 after:left-0 
                    after:w-0 after:h-0.5 after:bg-blue-500 
                    after:transition-all hover:after:w-full"
                >
                  {link}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {isHome ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className={`${buttonStyle} bg-blue-600 text-white hover:bg-blue-700`}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className={`${buttonStyle} border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900`}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={isSignup ? "/login" : "/signup"}
                  className={`${buttonStyle} bg-blue-600 text-white hover:bg-blue-700`}
                >
                  {isSignup ? "Login" : "Sign Up"}
                </Link>
              </motion.div>
            )}
            <div className="ml-2">
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <ModeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="text-2xl focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaXmark /> : <IoMenu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map(({ link, path }) => (
                  <motion.div
                    key={link}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={path}
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link}
                    </Link>
                  </motion.div>
                ))}
                <div className="space-y-2 pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/signup"
                      className="block w-full text-center px-4 py-2 border border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;