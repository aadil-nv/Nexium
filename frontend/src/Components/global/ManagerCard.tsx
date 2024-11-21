import React from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaUserLock, FaUnlock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import icons for verified/unverified
import useTheme from '../../hooks/useTheme';
import {IManagerCardProps} from '../../interface/managerInterface'



const ManagerCard: React.FC<IManagerCardProps> = ({
  image,
  name,
  email,
  onViewDetails,
  onToggleStatus,
  isActive,
  isVerified,
  isBlocked,
}) => {
  const { themeColor, themeMode } = useTheme();

  return (
    <div className="w-full sm:w-72 md:w-80 lg:w-96 mx-auto bg-white rounded-lg shadow-lg overflow-hidden text-center relative">
      {/* Status Indicator */}
      <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />

      {/* Manager Image */}
      <img className="w-24 h-24 object-cover rounded-full mx-auto mt-4" src={image} alt="Manager Profile" />

      <div className="p-4">
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
          
          {/* Verified Icon */}
          {isVerified ? (
            <FaCheckCircle className="text-green-500 ml-2" size={20}/>
          ) : (
            <FaTimesCircle className="text-red-500 ml-2" size={20} />
          )}
        </div>

        <p className="text-gray-600 text-sm truncate">{email}</p>

        <div className="mt-4 flex flex-col sm:flex-row md:flex-row justify-center gap-2">
          {/* More Info Button with Icon */}
          <motion.button
            onClick={onViewDetails}
            className="text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full sm:w-auto md:w-auto flex items-center justify-center gap-2 text-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ backgroundColor: themeColor }}
          >
            <FaInfoCircle size={16} /> {/* Smaller icon size */}
            <span className="text-sm">Info</span> {/* Adjusted text size */}
          </motion.button>

          {/* Block/Unblock Button with Dynamic Color and Icon */}
          <motion.button
            onClick={onToggleStatus}
            className={`text-white px-4 py-2 rounded transition duration-300 w-full sm:w-auto md:w-auto flex items-center justify-center gap-2 text-sm ${isBlocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isBlocked ? <FaUserLock size={16} /> : <FaUnlock size={16} />} {/* Smaller icon size */}
            <span className="text-sm">{isBlocked ? 'Block' : 'Unblock'}</span> {/* Adjusted text size */}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ManagerCard;
