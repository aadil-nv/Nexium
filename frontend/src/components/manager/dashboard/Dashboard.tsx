import React, { useEffect, useState } from 'react';
import { getAllManagers } from '../../../api/managerApi'; // Ensure the correct path to the API file
import { motion } from 'framer-motion';
import useAuth from '../../../hooks/useAuth';

interface Manager {
  _id: string;
  name: string;
  email: string;
  // Add other manager fields as required
}

export default function Dashboard() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [error, setError] = useState<string | null>(null);
  const {manager} = useAuth()

  useEffect(() => {
    // Fetch managers when the component mounts
    const fetchManagers = async () => {
      try {
        const data = await getAllManagers();
        console.log("data", data);
        
        setManagers(data);
      } catch (error) {
        setError('Failed to load managers');
        console.error(error);
      }
    };

    fetchManagers();
  }, []);

  return (
    <div className="p-5">
      <motion.h1 
        className="text-3xl font-bold text-blue-800 mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Departments
      </motion.h1>

      {error && (
        <motion.p
          className="text-red-500 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      )}

      {managers.length > 0 ? (
        <ul>
          {managers.map((manager) => (
            <motion.li 
              key={manager._id} 
              className="py-3 px-4 mb-3 border border-gray-300 rounded-lg bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-lg font-semibold text-gray-800">{manager.name}</p>
              <p className="text-sm text-gray-600">{manager.email}</p>
            </motion.li>
          ))}
        </ul>
      ) : (
        <motion.p
          className="text-gray-600 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No managers available.
        </motion.p>
      )}


      <div>
        <p className="text-gray-600 mt-5">managerName :, {manager?.managerName}</p>
        <p className="text-gray-600 mt-5">companyLogo :, {manager?.companyLogo}</p> 
        <p className="text-gray-600 mt-5">companyName :, {manager?.companyName}</p> 
        <p className="text-gray-600 mt-5">managerType :, {manager?.managerType}</p> 
        <p className="text-gray-600 mt-5">managerProfilePicture :, {manager?.managerProfilePicture}</p> 


      </div>
    </div>
  );
}
