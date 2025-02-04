import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import images from "../../../images/images";
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
    <footer className={`py-12 ${
      theme === 'dark'
        ? 'bg-gradient-to-r from-black to-gray-900 text-white'
        : 'bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800'
    } shadow-lg`}>
      <motion.div 
        className="container mx-auto px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src={images.navBarLogo} alt="Logo" className="h-14" />
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-8 text-lg">
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

          <motion.div className="flex gap-6">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="transform hover:text-blue-500"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="h-6 w-6" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <motion.div variants={containerVariants}>
            <h5 className="text-xl font-bold mb-6">Quick Links</h5>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={containerVariants}>
            <h5 className="text-xl font-bold mb-6">Contact Us</h5>
            <div className="space-y-4">
              {[
                { label: 'Email', value: 'aadilev2000gmail.com' },
                { label: 'Phone', value: '+123 456 7890' },
                { label: 'Address', value: 'Brototype project' }
              ].map(({ label, value }) => (
                <p key={label} className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">{label}:</span> {value}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div variants={containerVariants}>
            <h5 className="text-xl font-bold mb-6">Newsletter</h5>
            <motion.form className="space-y-4">
              <motion.input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center text-sm border-t border-gray-200 dark:border-gray-700 pt-8"
          variants={containerVariants}
        >
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}