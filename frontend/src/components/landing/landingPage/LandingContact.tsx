import  { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';
import contactimage from "../../../assets/landingPageAssets/contactimage.png"

export default function LandingContact() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", duration: 0.8 }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-20"
        initial="hidden"
        animate="visible"
      >
        <div className={`rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="grid md:grid-cols-2 gap-0">
            <motion.div 
              className="p-12 relative z-10"
              variants={fadeIn}
            >
              <motion.h2 
                className={`text-5xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                variants={fadeIn}
              >
                Let's Connect
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {['name', 'email'].map((field) => (
                  <motion.div key={field} className="overflow-hidden">
                    <motion.input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      }`}
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                  </motion.div>
                ))}

                <motion.textarea
                  name="message"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  rows={4}
                  whileFocus={{ scale: 1.02 }}
                  required
                />

                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-medium py-4 px-6 rounded-xl"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            <motion.div 
              className="relative h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={contactimage}
                alt="Contact"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}