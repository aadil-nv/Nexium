import React, { useState, useEffect } from 'react';
import { MdAddBusiness } from 'react-icons/md';
import DepartmentCard from '../../global/DepartmentCard';
import useTheme from '../../../hooks/useTheme';
import AddDepartmentModal from '../../ui/AddDepartment';
import { fetchEmployeesAPI, fetchDepartmentsAPI, removeDepartmentAPI } from '../../../api/managerApi';
import { IEmployee, IDepartment } from '../../../interface/managerInterface';

export default function Departments() {
  const { themeColor } = useTheme();
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchEmployeesAPI().then(setEmployees).catch(console.error);
    fetchDepartmentsAPI().then(setDepartments).catch(console.error);
  }, []);

  const handleAddNewDepartment = (newDepartment: IDepartment) =>
    setDepartments((prev) => [newDepartment, ...prev]);

  const handleRemoveDepartment = async (departmentId: string) => {
    try {
      await removeDepartmentAPI(departmentId);
      setDepartments((prev) => prev.filter((dept) => dept._id !== departmentId));
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
        {departments.map(({ _id, departmentName, employees }) => (
          <DepartmentCard
            key={_id}
            departmentName={departmentName}
            employees={employees.map(({ id, name, position, profilePicture, email, isActive }) => ({
              id,
              name,
              position,
              photo: profilePicture,
              email: email || '',
              isOnline: isActive || false,
            }))}
            themeColor={themeColor}
            departmentId={_id}
            onEditEmployee={(employeeId) => console.log('Edit employee', employeeId)}
            onRemoveEmployee={(employeeId) =>
              setDepartments((prev) =>
                prev.map((dept) =>
                  dept._id === _id
                    ? { ...dept, employees: dept.employees.filter((emp) => emp.id !== employeeId) }
                    : dept
                )
              )
            }
            onRemoveDepartment={() => handleRemoveDepartment(_id)}
          />
        ))}
      </div>

      <AddDepartmentModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddDepartment={handleAddNewDepartment}
        employees={employees}
      />
    </div>
  );
}
