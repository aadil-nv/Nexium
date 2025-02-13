import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { Modal, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AddCandidateModal from './AddCandidateModal';
import { removeEmployee, updateDepartmentName } from '../../api/managerApi';
import { IDepartmentCardProps } from '../../interface/GlobalInterface';
import { IEmployee } from '../../interface/managerInterface';

const { confirm } = Modal;

export default function DepartmentCard({
  departmentName,
  employees,
  themeColor,
  onRemoveEmployee,
  onRemoveDepartment,
  departmentId,
}: IDepartmentCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [departmentEmployees, setDepartmentEmployees] = useState<IEmployee[]>(employees);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState(departmentName);

  const handleAddCandidate = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const showRemoveConfirm = (employeeId: string, employeeName: string) => {
    confirm({
      title: 'Are you sure you want to remove this employee?',
      icon: <ExclamationCircleOutlined />,
      content: `You are about to remove ${employeeName} from ${departmentName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await removeEmployee(employeeId, departmentId);
          onRemoveEmployee(employeeId);
          setDepartmentEmployees((prev) => prev.filter((emp) => emp.employeeId !== employeeId));
          message.success('Employee removed successfully');
        } catch (error) {
          console.error('Error removing employee:', error);
          message.error('Failed to remove employee');
        }
      },
    });
  };

  const handleEmployeesAdded = (newEmployees: IEmployee[]) => {
    setDepartmentEmployees((prev) => [...prev, ...newEmployees]);
  };

  const handleNameEdit = async () => {
    if (isEditingName && newDepartmentName !== departmentName) {
      try {
        await updateDepartmentName(departmentId, newDepartmentName);
        message.success('Department name updated successfully');
      } catch (error) {
        console.error('Error updating department name:', error);
        setNewDepartmentName(departmentName);
      }
    }
    setIsEditingName(!isEditingName);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${themeColor}0A, white)`,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center gap-2">
          {isEditingName ? (
            <Input
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              onPressEnter={handleNameEdit}
              autoFocus
              className="text-lg font-bold"
            />
          ) : (
            <h2 className="text-lg font-bold text-gray-800 truncate">
              {newDepartmentName}
            </h2>
          )}
          <div className="flex gap-2">
            <button
              className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
              onClick={handleNameEdit}
              aria-label={isEditingName ? "Save Name" : "Edit Name"}
            >
              <FaEdit size={16} />
            </button>
            <button
              className="p-2 text-green-500 hover:bg-green-100 rounded-full transition-colors"
              onClick={handleAddCandidate}
              aria-label="Add Candidate"
            >
              <FaPlus size={16} />
            </button>
            <button
              className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
              onClick={onRemoveDepartment}
              aria-label="Remove Department"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {departmentEmployees.map((employee) => (
            <motion.div
              key={employee.employeeId}
              className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={employee.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png"}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover border-2"
                      style={{ borderColor: themeColor }}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        employee.isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {employee.name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {employee.position}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {employee.email}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                  onClick={() => showRemoveConfirm(employee.employeeId || '', employee.name || '')}
                  aria-label="Remove Employee"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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