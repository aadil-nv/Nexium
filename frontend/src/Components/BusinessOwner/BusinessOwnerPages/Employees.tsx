import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Employees = () => {
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);

  // Sample employee data
  const initialEmployees = [
    { id: 1, name: 'John Doe', position: 'Manager', department: 'Sales', location: 'New York', status: 'Active' },
    { id: 2, name: 'Jane Smith', position: 'Developer', department: 'IT', location: 'San Francisco', status: 'Inactive' },
    { id: 3, name: 'Sam Wilson', position: 'Designer', department: 'Marketing', location: 'Los Angeles', status: 'Active' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [employees, setEmployees] = useState(initialEmployees);

  const addEmployee = () => {
    const newEmployee = { id: employees.length + 1, name: 'New Employee', position: 'Intern', department: 'HR', location: 'Remote', status: 'Active' };
    setEmployees([...employees, newEmployee]);
  };

  // Filtered employee list based on search term and status filter
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          style={{ borderColor: currentColor, color: currentColor }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          style={{ borderColor: currentColor, color: currentColor }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Add Employee Button */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          onClick={addEmployee}
          style={{ backgroundColor: currentColor }}
        >
          Add Employee
        </button>
      </div>

      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <table className="min-w-full table-auto border-collapse rounded" style={{ borderRadius: '100px' }}>
          <thead className="bg-gray-100 ">
            <tr className="bg-gray-200  " style={{ backgroundColor: currentColor }}>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Position</th>
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Location</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <motion.tr
                key={employee.id}
                className="hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * employee.id }}
              >
                <td className="border border-gray-300 p-2 text-gray-800">{employee.id}</td>
                <td className="border border-gray-300 p-2 text-gray-800">{employee.name}</td>
                <td className="border border-gray-300 p-2 text-gray-800">{employee.position}</td>
                <td className="border border-gray-300 p-2 text-gray-800">{employee.department}</td>
                <td className="border border-gray-300 p-2 text-gray-800">{employee.location}</td>
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
    </div>
  );
};

export default Employees;
