import { useState, useEffect } from 'react';
import { IEmployee } from '../../../interface/managerInterface';
import useTheme from '../../../hooks/useTheme';
import useAuth from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { fetchEmployees } from '../../../api/managerApi';
import EmployeesList from './EmployeesTable';
import { FaPlus } from 'react-icons/fa';
import AddEmployeeModal from '../../global/AddEmployeeModal';
import { Empty } from 'antd';  // Import the Empty component

export default function Employees() {
  const [employeeData, setEmployeeData] = useState<IEmployee[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); // State to trigger re-fetching data
  const { themeColor } = useTheme();
  const { manager } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch employee data whenever updateTrigger changes
  useEffect(() => {
    fetchEmployees()
      .then(setEmployeeData)
      .catch((error) => console.error('Error fetching employee data:', error));
  }, [updateTrigger]); // Re-fetch when `updateTrigger` changes



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
        {/* Display "No Data" from Ant Design if there are no employees */}
        {employeeData.length === 0 ? (
          <Empty description="No employees found" />
        ) : (
          <EmployeesList 
            data={employeeData} 
            loading={!employeeData.length} 
            error={null} 
            onUpdate={() => setUpdateTrigger((prev) => prev + 1)} // Trigger re-fetch after update
          />
        )}
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
