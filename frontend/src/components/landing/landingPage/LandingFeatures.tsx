import { motion } from 'framer-motion';
import FeaturesDatabase from '../../../assets/landingPageAssets/Human-Resources-square-ezgif.com-webp-to-png-converter.png';
import FeaturesOnboarding from '../../../assets/landingPageAssets/Onboarding-ezgif.com-webp-to-png-converter.png';
import leavemanagement from '../../../assets/landingPageAssets/leavemenegement-Photoroom.png';

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 30px rgba(0, 0, 255, 0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    hover: {
      color: "#4F46E5",
      transition: { duration: 0.2 }
    }
  };

  const featuresList = [
    {
      title: "Leave Management",
      description: "Streamline leave requests and approvals, track leave balances, and manage leave policies efficiently.",
      image: leavemanagement,
      details: "Our Leave Management system automates the entire leave application process, allowing employees to submit requests easily and managers to approve them with just a few clicks."
    },
    {
      title: "Employee Management",
      description: "Manage employee records, onboarding, and offboarding processes seamlessly.",
      image: FeaturesDatabase,
      details: "With our Employee Management feature, you can maintain comprehensive employee profiles, track performance evaluations, and manage training programs."
    },
    {
      title: "Payroll Management",
      description: "Automate payroll calculations, deductions, and payments to ensure timely compensation for employees.",
      image: FeaturesOnboarding,
      details: "Our Payroll Management system guarantees accurate and timely payments to employees. It automatically calculates taxes, deductions, and bonuses."
    }
  ];

  return (
    <motion.div 
      className="py-32 md:px-14 px-4 max-w-screen-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col lg:flex-row items-start gap-12">
        <motion.div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
            >
              <div className="overflow-hidden">
                <motion.img
                  variants={imageVariants}
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 object-cover"
                />
              </div>
              <motion.div className="p-6 space-y-3">
                <motion.h4 
                  variants={textVariants}
                  className="text-xl font-semibold black dark:text-white"
                >
                  {feature.title}
                </motion.h4>
                <motion.p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </motion.p>
                <motion.p className="text-xs text-gray-500 dark:text-gray-300 mt-4">
                  {feature.details}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="lg:w-1/3 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h3 
            className="text-4xl font-bold text-primary dark:text-white"
            whileHover={{ scale: 1.02 }}
          >
            Key Features of NEXIUM
          </motion.h3>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-base text-tertiary dark:text-gray-400">
              Discover the outstanding features that make our platform the best choice for you.
            </p>
            <p className="text-base text-tertiary dark:text-gray-400">
              Our HR Management System is designed to simplify and streamline various HR processes.
            </p>
            <p className="text-base text-tertiary dark:text-gray-400">
              Explore each feature to understand how it can benefit your business.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}