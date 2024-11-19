import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEllipsisV } from 'react-icons/fa';
import useTheme from '../../hooks/useTheme';
import AddCandidateModal from './AddCandidateModal';
import axios from 'axios';

interface Employee {
  id: string;
  photo: string;
  name: string;
  email: string;
  position: string;
  isOnline: boolean;
}

interface DepartmentCardProps {
  departmentName: string;
  employees: Employee[];
  themeColor: string;
  onEditEmployee: (id: string) => void;
  onRemoveEmployee: (id: string) => void;
  onRemoveDepartment: () => void;
  departmentId:string
}

export default function DepartmentCard({
  departmentName,
  employees,
  themeColor,
  onEditEmployee,
  onRemoveEmployee,
  onRemoveDepartment,
  departmentId,
}: DepartmentCardProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // For toggling modal visibility
  const { isActiveMenu, themeMode } = useTheme();

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAddCandidate = () => {
    setIsModalVisible(true); // Show the modal when "Add Candidate" is clicked
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  // Function to handle employee removal
  const handleRemoveEmployee = async (employeeId: string) => {
    try {
      const response = await axios.patch(
        'http://localhost:3000/manager/api/department/remove-employee',
        {
          employeeId, // employee ID to be removed
          departmentId: departmentId, // department ID (you should send the correct department ID)
        }
      );
      // Immediately update the UI without requiring a page refresh
      onRemoveEmployee(employeeId);
      console.log('Employee removed successfully:', response.data);
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  

  return (
    <motion.div
      className={`w-full max-w-md bg-white shadow-lg rounded-lg p-5 relative transition-all duration-300 ease-in-out`}
      style={{
        borderColor: themeColor,
        borderWidth: 2,
        width: '100%',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top section with department name and dropdown */}
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-xl font-bold text-gray-800">{departmentName}</h2>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            className=" text-gray-800 font-semibold py-2 px-4 rounded-full z-10 hover:bg-gray-300 transition"
            onClick={() => toggleMenu('options')}
          >
            <FaEllipsisV />
          </button>
          {openMenuId === 'options' && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-32 z-20">
              <button
                className="w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                onClick={handleAddCandidate} // Trigger the modal
              >
                Add Candidate
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                onClick={onRemoveDepartment}
              >
                Remove Department
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Employees list */}
      <ul className="space-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {employees.map((employee) => (
          <li key={employee.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={employee.photo}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${employee.isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-800 font-medium">{employee.name}</p>
                <p className="text-sm text-gray-600">{employee.email}</p>
                <p className="text-sm text-gray-500">{employee.position}</p>
              </div>
            </div>

            {/* Dropdown menu for actions */}
            <div className="relative">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => toggleMenu(employee.id)}
              >
                <FaEllipsisV />
              </button>
              {openMenuId === employee.id && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-32 z-20">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                    onClick={() => onEditEmployee(employee.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    onClick={() => handleRemoveEmployee(employee.id)} // Call remove employee function
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Show the AddCandidateModal when isModalVisible is true */}
      {isModalVisible && (
        <AddCandidateModal isVisible={isModalVisible} onClose={handleCloseModal} />
      )}
    </motion.div>
  );
}
