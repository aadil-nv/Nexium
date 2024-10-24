import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Employees = () => {
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);

  // Sample employee data
  const employees = [
    { id: 1, name: 'John Doe', position: 'Manager', department: 'Sales', location: 'New York', status: 'Active' },
    { id: 2, name: 'Jane Smith', position: 'Developer', department: 'IT', location: 'San Francisco', status: 'Inactive' },
    { id: 3, name: 'Sam Wilson', position: 'Designer', department: 'Marketing', location: 'Los Angeles', status: 'Active' },
    // Add more employees as needed
  ];

  return (
    <div className="p-4">
      <motion.h1
        className="text-2xl font-bold mb-6"
        style={{ color: currentColor }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Employee List
      </motion.h1>

      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Position</th>
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Location</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <motion.tr
                key={employee.id}
                className="hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * employee.id }}
              >
                <td className="border border-gray-300 p-2">{employee.id}</td>
                <td className="border border-gray-300 p-2">{employee.name}</td>
                <td className="border border-gray-300 p-2">{employee.position}</td>
                <td className="border border-gray-300 p-2">{employee.department}</td>
                <td className="border border-gray-300 p-2">{employee.location}</td>
                <td
                  className={`border border-gray-300 p-2 ${
                    employee.status === 'Active' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {employee.status}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Responsive design for mobile */}
     
    </div>
  );
};

export default Employees;
