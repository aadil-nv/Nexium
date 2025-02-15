import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import navBarLogo from "../../../assets/landingPageAssets/NavbarLogo.png";
import { useTheme } from './theme-provider';

export default function Footer() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  return (
    <footer className={`py-6 sm:py-8 ${
      theme === 'dark'
        ? 'bg-gradient-to-r from-black to-gray-900 text-white'
        : 'bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800'
    } shadow-lg`}>
      <motion.div 
        className="container mx-auto px-3 sm:px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src={navBarLogo} alt="Logo" className="h-8 sm:h-10" />
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
            {['Home', 'About Us', 'Services', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="relative group"
                whileHover={{ scale: 1.1 }}
              >
                {item}
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full"
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </motion.div>

          <motion.div className="flex gap-3 sm:gap-4">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="transform hover:text-blue-500"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <motion.div variants={containerVariants}>
            <h5 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Quick Links</h5>
            <ul className="space-y-1 sm:space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a href="#" className="hover:text-blue-500 transition-colors text-xs sm:text-sm">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={containerVariants}>
            <h5 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Contact Us</h5>
            <div className="space-y-1 sm:space-y-2">
              {[
                { label: 'Email', value: 'aadilev2000gmail.com' },
                { label: 'Phone', value: '+123 456 7890' },
                { label: 'Address', value: 'Brototype project' }
              ].map(({ label, value }) => (
                <p key={label} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">{label}:</span> {value}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div variants={containerVariants} className="sm:col-span-2">
            <h5 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Newsletter</h5>
            <motion.form className="flex gap-2">
              <motion.input
                type="email"
                placeholder="Your Email"
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-xs sm:text-sm"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="bg-blue-500 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg shadow-md hover:bg-blue-600 text-xs sm:text-sm whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center text-[10px] sm:text-xs border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4"
          variants={containerVariants}
        >
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}