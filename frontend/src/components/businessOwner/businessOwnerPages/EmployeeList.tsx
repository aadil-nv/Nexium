import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ManagerCard from '../../global/ManagerCard';
import useTheme from '../../../hooks/useTheme';
import {businessOwnerInstance} from '../../../services/businessOwnerInstance'
import { Skeleton, Empty } from 'antd';
import AddEmployeeModal from '../../ui/AddEmployeeModal';
import { FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {logout as businessOwnerLogout}  from '../../../features/businessOwnerSlice';
import axios from 'axios';

export default function EmployeeList() {
  const [managers, setManagers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { themeColor } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    businessOwnerInstance.get('/businessOwner/api/manager/get-managers')
      .then((response) => {
        setManagers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching managers:', error);
        axios.post('http://localhost:3000/businessOwner/api/business-owner/logout');
        dispatch(businessOwnerLogout());
        setLoading(false);
      });
  }, []);

  const filteredManagers = managers.filter(manager => 
    manager.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (roleFilter === 'All' || manager.role === roleFilter)
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (role: string) => {
    setRoleFilter(role);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold w-full sm:w-auto text-center sm:text-left">Employee List</h1>
        <motion.button
            onClick={() => setIsModalVisible(true)}
            style={{ backgroundColor: themeColor }}
            className="flex items-center text-white px-4 py-2 rounded-md transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-2" /> Add Employee
          </motion.button>
      </div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-72 p-2 border border-gray-300 rounded-md"
        />
      </motion.div>

      <div className="mb-6 flex flex-wrap justify-start gap-2">
        {['All', 'Manager', 'Admin', 'Employee'].map((role) => (
          <button
            key={role}
            onClick={() => handleFilterChange(role)}
            className={`px-4 py-2 rounded-md ${roleFilter === role ? 'bg-gray-300' : 'bg-blue-500'} text-white`}
            style={{ backgroundColor: roleFilter === role ? '#ccc' : themeColor }}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex justify-center">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </div>
          ))
        ) : filteredManagers.length === 0 ? (
          <div className="flex justify-center items-center align-center ">
            <Empty description="No employees found" />
          </div>
        ) : (
          filteredManagers.map((manager, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex justify-center"
            >
              <ManagerCard
                image={manager.profilePicture}
                name={manager.name}
                email={manager.email}
                onViewDetails={() => alert(`Viewing details for ${manager.name}`)}
                onToggleStatus={() => alert(`Blocking/Unblocking ${manager.name}`)}
                isActive={manager.isActive}
                isBlocked={manager.isBlocked}
                isVerified={manager.isVerified}
              />
            </motion.div>
          ))
        )}
         <AddEmployeeModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      </div>
    </div>
  );
}
