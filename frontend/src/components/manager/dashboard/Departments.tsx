import  { useState, useEffect } from 'react';
import { MdAddBusiness } from 'react-icons/md';
import DepartmentCard from '../../global/DepartmentCard';
import useTheme from '../../../hooks/useTheme';
import AddDepartmentModal from '../../ui/AddDepartment';
import {  fetchDepartmentsAPI, removeDepartmentAPI } from '../../../api/managerApi';
import { IDepartment } from '../../../interface/managerInterface';

export default function Departments() {
  const { themeColor } = useTheme();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchDepartmentsAPI().then(setDepartments).catch(console.error);
  }, []);

  const handleAddNewDepartment = (newDepartment: IDepartment) =>
    setDepartments((prev) => [newDepartment, ...prev]);

  const handleRemoveDepartment = async (departmentId: string) => {
    try {
      await removeDepartmentAPI(departmentId);
      fetchDepartmentsAPI().then(setDepartments).catch(console.error);
      console.log('Department removed successfully');
    } catch (error) {
      console.error('Error removing department:', error);
    }
  };
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <button
          style={{ backgroundColor: themeColor }}
          className="hover:opacity-90 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2"
          onClick={() => setIsModalVisible(true)}
        >
          <MdAddBusiness className="text-xl" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {departments.map(({ departmentId, departmentName, employees }) => (
          <DepartmentCard
            key={departmentId}
            departmentName={departmentName}
            employees={employees.map(({ employeeId, name, position, profilePicture, email, isActive }) => ({
              employeeId: employeeId, 
              name: name || '', 
              position: position || '', 
              profilePicture: profilePicture || "", 
              email: email || '', 
              isOnline: isActive ?? false, 
            }))}
            themeColor={themeColor}
            departmentId={departmentId}
            onEditEmployee={(employeeId) => console.log('Edit employee', employeeId)}
            onRemoveEmployee={(employeeId) =>
              setDepartments((prev) =>
                prev.map((dept) =>
                  dept.departmentId === departmentId
                    ? { ...dept, employees: dept.employees.filter((emp) => emp.employeeId !== employeeId) }
                    : dept
                )
              )
            }
            onRemoveDepartment={() => handleRemoveDepartment(departmentId)}
          />
        ))}
      </div>

      <AddDepartmentModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddDepartment={handleAddNewDepartment}
      />
    </div>
  );
}