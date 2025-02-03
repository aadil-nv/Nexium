import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';
import homeImage from "../../../assets/landingPageAssets/signupbackground-removebg.png";

export default function Home() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        duration: 1
      }
    },
    hover: {
      scale: 1.02,
      rotate: 2,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div 
      className='md:px-8 p-6 max-w-screen-2xl mx-auto mt-8 flex flex-col md:flex-row items-center'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className='md:w-1/2 space-y-4 md:space-y-6 flex flex-col justify-center mt-8 md:mt-12 px-4 md:px-10'>
        <motion.h2 
          variants={headingVariants}
          className={`text-2xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black-800'} mb-2`}
        >
          Welcome to Nexium
        </motion.h2>
        
        <motion.p 
          variants={textVariants}
          className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}
        >
          Transform your business management with Nexium's comprehensive solution. Our platform streamlines operations, enhances productivity, and drives growth through intelligent automation. Experience seamless project tracking, resource allocation, and team collaboration all in one place.
        </motion.p>

        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4'>
          <motion.button 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm md:text-base'
          >
            <a href="/dashboard">Start Managing</a>
          </motion.button>
          
          <motion.button 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className='border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 text-sm md:text-base'
          >
            View Features
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className='md:w-1/2 mt-6 md:mt-0 flex justify-center items-center'
        variants={imageVariants}
        whileHover="hover"
      >
        <motion.img
          src={homeImage}
          alt="Business Management"
          className='max-w-full h-auto rounded-md shadow-lg transition-all duration-300 max-h-[650px]'
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.1}
        />
      </motion.div>
    </motion.div>
  );
}