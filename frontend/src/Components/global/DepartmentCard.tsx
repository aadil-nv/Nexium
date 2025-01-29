import  { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaPlus } from 'react-icons/fa';
import AddCandidateModal from './AddCandidateModal';
import { removeEmployee } from '../../api/managerApi';
import { IDepartmentCardProps } from '../../interface/GlobalInterface';
import { IEmployee } from '../../interface/managerInterface';

export default function DepartmentCard({
  departmentName,
  employees,
  themeColor,
  onRemoveEmployee,
  onRemoveDepartment,
  departmentId,
}: IDepartmentCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [departmentEmployees, setDepartmentEmployees] = useState<IEmployee[]>(employees)  

  const handleAddCandidate = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleRemoveEmployeeClick = async (employeeId: string) => {
    try {
      await removeEmployee(employeeId, departmentId);
      onRemoveEmployee(employeeId);
      setDepartmentEmployees((prev) => prev.filter((emp) => emp.employeeId !== employeeId));
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  const handleEmployeesAdded = (newEmployees: IEmployee[]) => {
    setDepartmentEmployees((prev) => [...prev, ...newEmployees]);
  };

  return (
    <motion.div
      className="w-full max-w-sm bg-white shadow-lg rounded-lg p-4 sm:p-5 mx-auto"
      style={{
        borderColor: themeColor,
        borderWidth: 2,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-2">
          {departmentName}
        </h2>
        <div className="flex gap-2">
          <button
            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors flex items-center gap-1"
            onClick={handleAddCandidate}
            aria-label="Add Candidate"
          >
            <FaPlus size={16} />
          </button>
          <button
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors flex items-center gap-1"
            onClick={onRemoveDepartment}
            aria-label="Remove Department"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      <ul className="space-y-2 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {departmentEmployees.map((employee) => (
          <li key={employee.employeeId} className="p-2 bg-gray-100 rounded-lg">
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-start space-x-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={employee.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png"}
                    alt={employee.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${
                      employee.isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{employee.name}</p>
                  <p className="text-xs text-gray-600 truncate">{employee.email}</p>
                  <p className="text-xs text-gray-500 truncate">{employee.position}</p>
                </div>
              </div>
              <button
                className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                onClick={() => handleRemoveEmployeeClick(employee.employeeId || '')}
                aria-label="Remove Employee"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalVisible && (
        <AddCandidateModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          departmentId={departmentId}
          onEmployeesAdded={handleEmployeesAdded}
        />
      )}
    </motion.div>
  );
}