import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../global/Table';
import { Employee } from '../../../utils/interfaces';
import { ColumnDef } from '@tanstack/react-table';
import useTheme from '../../../hooks/useTheme';
import useAuth from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaEdit, FaUserLock, FaSignOutAlt } from 'react-icons/fa';
import {managerInstance} from "../../../services/managerInstance"

export default function Employees() {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const { themeColor } = useTheme();
  const { manager } = useAuth();
  const isManager = manager?.isAuthenticated;

  // Fetch employee data from the API
  useEffect(() => {
    const fetchEmployeeData = async () => {
      console.log("hiting fetch employee=======");
      
      try {
        const response = await managerInstance.get('/manager/api/employee/get-employees');
        console.log("response ====",response);
        
        const employees = response.data.map((employee: any) => ({
          id: employee._id,
          name: employee.personalDetails?.firstName + ' ' + employee.personalDetails?.lastName,
          position: employee.professionalDetails?.position,
          email: employee.personalDetails?.email,
          isOnline: employee.isActive,
        }));
        console.log("employees",employees);
        
        setEmployeeData(employees);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
  
    fetchEmployeeData();
  }, []);
  

  // Handle actions like Edit, Remove, and Block
  const handleEdit = (employeeId: string) => {
    console.log(`Edit employee with ID: ${employeeId}`);
  };

  const handleRemove = (employeeId: string) => {
    console.log(`Employee with ID: ${employeeId} left`);
  };

  const handleBlock = (employeeId: string) => {
    console.log(`Block employee with ID: ${employeeId}`);
  };

  const columns: ColumnDef<Employee>[] = [
    {
      id: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Position',
      accessorKey: 'position',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
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
        loading={!employeeData.length} // Set loading state accordingly
        error={null} // Handle errors if any
      />
    </div>
  );
}
