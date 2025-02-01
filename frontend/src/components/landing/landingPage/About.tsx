import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';

const About = () => {
  const { theme } = useTheme();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/40'
        }`} />
        <div className={`absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100/40'
        }`} />
      </div>

      {/* Main Content */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="relative md:px-8 p-6 max-w-screen-2xl mx-auto pt-16"
      >
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div 
            className="md:w-1/2 space-y-6"
            variants={fadeInUp}
          >
            <motion.h1 
              className={`text-4xl md:text-5xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              variants={fadeInUp}
            >
              Transform Your HR Management
            </motion.h1>
            
            <motion.p 
              className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
              variants={fadeInUp}
            >
              Experience the next generation of HR management with our comprehensive HRMS solution. 
              We combine cutting-edge technology with intuitive design to streamline your HR operations 
              and empower your team to achieve more.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 
                  transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <a href="/superadmin-login">Get Started</a>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-lg font-semibold border-2 transition-colors duration-300 
                  shadow-lg hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'border-blue-500 text-blue-400 hover:bg-blue-900/30' 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src="/api/placeholder/600/400"
                alt="Modern HR Management"
                className="rounded-xl shadow-2xl w-full object-cover"
              />
              {/* Decorative elements */}
              <div className={`absolute -z-10 top-4 right-4 w-full h-full rounded-xl ${
                theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-200/50'
              }`} />
              <div className={`absolute -z-20 top-8 right-8 w-full h-full rounded-xl ${
                theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-200/50'
              }`} />
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          className="mt-24 grid md:grid-cols-3 gap-8"
          variants={staggerChildren}
        >
          {[
            {
              title: "Smart Automation",
              description: "Automate repetitive tasks and workflows to save time and reduce errors."
            },
            {
              title: "Data Analytics",
              description: "Make data-driven decisions with powerful analytics and reporting tools."
            },
            {
              title: "Employee Experience",
              description: "Create a better workplace with employee-centric features and tools."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`p-6 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 hover:bg-gray-800/70' 
                  : 'bg-white/80 hover:bg-white'
              } backdrop-blur-sm transition-colors duration-300 shadow-lg hover:shadow-xl`}
            >
              <h3 className={`text-xl font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;