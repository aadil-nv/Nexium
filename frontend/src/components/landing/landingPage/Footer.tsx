import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import images from "../../../images/images"
import { useTheme } from './theme-provider';
export default function Footer() {
    const { theme } = useTheme();  
    return (
        <footer
          className={`py-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-black to-gray-900 text-white'
              : 'bg-gradient-to-r from-white-900 to-gray-300 text-black'
          }`}
        >
          <div className="container mx-auto px-4">
            {/* Main Section */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
             
              <div className="flex items-center mb-4 md:mb-0">
                <img src={images.navBarLogo} alt="Your Logo" className="h-12" /> 
              </div>
    
            
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
                <a href="#" className="hover:text-gray-600">
                  Home
                </a>
                <a href="#" className="hover:text-gray-600">
                  About Us
                </a>
                <a href="#" className="hover:text-gray-600">
                  Services
                </a>
                <a href="#" className="hover:text-gray-600">
                  Contact
                </a>
              </div>
    
              {/* Social Media Section */}
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" aria-label="Facebook" className="hover:text-gray-600">
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="#" aria-label="Twitter" className="hover:text-gray-600">
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-gray-600">
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:text-gray-600">
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
    
            {/* Additional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Quick Links Section */}
              <div>
                <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-gray-600">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-600">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-600">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
    
              {/* Contact Section */}
              <div>
                <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
                <p className="text-gray-700">
                  Email: info@yourcompany.com
                </p>
                <p className="text-gray-700">Phone: +123 456 7890</p>
                <p className="text-gray-700">Address: 123 Your Street, City, Country</p>
              </div>
    
              {/* Newsletter Section */}
              <div>
                <h5 className="text-lg font-semibold mb-4">Newsletter</h5>
                <form>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-2 rounded-md border border-gray-600 bg-white text-black mb-2 w-full"
                  />
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
    
            {/* Bottom Copyright Section */}
            <div className="text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </footer>
      );
}



