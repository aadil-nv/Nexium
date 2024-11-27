import React, { useState, useEffect } from 'react';
import Table from '../../global/Table';
import { IEmployee } from '../../../interface/managerInterface';
import { ColumnDef } from '@tanstack/react-table';
import useTheme from '../../../hooks/useTheme';
import useAuth from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaEdit, FaUserLock, FaSignOutAlt } from 'react-icons/fa';
import { fetchEmployees } from '../../../api/managerApi';

export default function Employees() {
  const [employeeData, setEmployeeData] = useState<IEmployee[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); // State to trigger re-fetching data
  const { themeColor } = useTheme();
  const { manager } = useAuth();
  const isManager = manager?.isAuthenticated;

  useEffect(() => {
    fetchEmployees()
      .then(setEmployeeData)
      .catch((error) => console.error('Error fetching employee data:', error));
  }, []); // Re-fetch when `updateTrigger` changes

  const handleEdit = (employeeId: string) => console.log(`Edit employee with ID: ${employeeId}`);
  const handleRemove = (employeeId: string) => {
    console.log(`Employee with ID: ${employeeId} left`);
    setUpdateTrigger((prev) => prev + 1); // Trigger re-fetch
  };
  const handleBlock = (employeeId: string) => {
    console.log(`Block employee with ID: ${employeeId}`);
    setUpdateTrigger((prev) => prev + 1); // Trigger re-fetch
  };

  const columns: ColumnDef<IEmployee>[] = [
    { id: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Position', accessorKey: 'position' },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Status',
      accessorKey: 'isOnline',
      cell: ({ row }) => (
        <span className={row.getValue('isOnline') ? 'text-green-500' : 'text-red-500'}>
          {row.getValue('isOnline') ? 'Online' : 'Offline'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-3 justify-center items-center">
          {isManager && (
            <>
              <motion.button
                onClick={() => handleEdit(row.id)}
                style={{ backgroundColor: themeColor }}
                className="text-white px-4 py-2 rounded-md flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit className="text-lg" />
                <span>Edit</span>
              </motion.button>

              <motion.button
                onClick={() => handleBlock(row.id)}
                className="text-white bg-yellow-500 px-4 py-2 rounded-md flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserLock className="text-lg" />
                <span>Block</span>
              </motion.button>

              <motion.button
                onClick={() => handleRemove(row.id)}
                className="text-white bg-red-500 px-4 py-2 rounded-md flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt className="text-lg" />
                <span>Fire</span>
              </motion.button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl text-red-800">Employees</h1>
      <Table
        data={employeeData}
        columns={columns}
        loading={!employeeData.length}
        error={null}
      />
    </div>
  );
}
