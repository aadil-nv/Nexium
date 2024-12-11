import React, { useState, useEffect } from 'react';
import Table from '../../global/Table';
import { IEmployee } from '../../../interface/managerInterface';
import { ColumnDef } from '@tanstack/react-table';
import useTheme from '../../../hooks/useTheme';
import useAuth from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaEdit, FaUserLock, FaSignOutAlt } from 'react-icons/fa';
import { fetchEmployees } from '../../../api/managerApi';
import EmployeesList from './EmployeesTable';
import { FaPlus } from 'react-icons/fa';
import AddEmployeeModal from '../../global/AddEmployeeModal';

export default function Employees() {
  const [employeeData, setEmployeeData] = useState<IEmployee[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); // State to trigger re-fetching data
  const { themeColor } = useTheme();
  const { manager } = useAuth();
  const isManager = manager?.isAuthenticated;
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch employee data whenever updateTrigger changes
  useEffect(() => {
    fetchEmployees()
      .then(setEmployeeData)
      .catch((error) => console.error('Error fetching employee data:', error));
  }, [updateTrigger]); // Re-fetch when `updateTrigger` changes

  const columns: ColumnDef<IEmployee>[] = [
    { id: 'ID', accessorKey: '_id' },
    { header: 'Name', accessorKey: 'employeeName' },
    { header: 'Position', accessorKey: 'position' },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }) => (
        <span className={row.getValue('isActive') ? 'text-green-500' : 'text-red-500'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="relative p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-red-800">Employees</h1>

        {/* Add Employee Button */}
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

      {/* Employees List */}
      <div className="mt-4">
        <EmployeesList 
          data={employeeData} 
          loading={!employeeData.length} 
          error={null} 
          onUpdate={() => setUpdateTrigger((prev) => prev + 1)} // Trigger re-fetch after update
        />
      </div>

      {/* Add Employee Modal */}
      {manager.isAuthenticated && (
        <AddEmployeeModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
          onManagerAdded={() => setUpdateTrigger((prev) => prev + 1)} 
        />
      )}
    </div>
  );
}
