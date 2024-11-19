import React, { useState, useEffect } from 'react';
import { MdAddBusiness } from 'react-icons/md';
import DepartmentCard from '../../global/DepartmentCard';
import useTheme from '../../../hooks/useTheme';
import AddDepartmentModal from '../../ui/AddDepartment';
import axios from 'axios';
import { managerInstance } from '../../../services/managerInstance';

interface Employee {
  id: string;
  photo: string;
  name: string;
  email: string;
  position: string;
  isOnline: boolean;
  profilePicture: string;
  isActive: boolean;
}

interface Department {
  _id: string;
  departmentName: string;
  employees: Employee[];
  departmentId: string;
}

export default function Departments() {
  const { themeColor } = useTheme();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch employees from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await managerInstance.get('/manager/api/employee/get-employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch departments from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/manager/api/department/get-departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Modal handlers
  const handleAddDepartment = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);

  // Add new department and update state
  const handleAddNewDepartment = (newDepartment: Department) => {
    setDepartments((prevDepartments) => [newDepartment, ...prevDepartments]);
    setIsModalVisible(false);
  };

  // Handle removing department
  const handleRemoveDepartment = async (departmentId: string) => {
    try {
      await axios.delete(`http://localhost:3000/manager/api/department/delete-department`, {
        data: { departmentId },
      });
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department._id !== departmentId)
      );
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
          onClick={handleAddDepartment}
        >
          <MdAddBusiness className="text-xl" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Render departments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {departments.map((department) => (
          <DepartmentCard
            key={department._id}
            departmentName={department.departmentName}
            employees={department.employees.map((employee) => ({
              id: employee.id,
              name: employee.name,
              position: employee.position,
              photo: employee.profilePicture,
              email: employee.email || '',
              isOnline: employee.isActive || false,
            }))}
            themeColor={themeColor}
            departmentId={department._id}
            onEditEmployee={(employeeId) => console.log('Edit employee', employeeId)}
            onRemoveEmployee={(employeeId) =>
              setDepartments((prevDepartments) =>
                prevDepartments.map((dept) =>
                  dept._id === department._id
                    ? {
                        ...dept,
                        employees: dept.employees.filter((emp) => emp.id !== employeeId),
                      }
                    : dept
                )
              )
            }
            onRemoveDepartment={() => handleRemoveDepartment(department._id)}
          />
        ))}
      </div>

      {/* Add Department Modal */}
      <AddDepartmentModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onAddDepartment={handleAddNewDepartment}
        employees={employees}
      />
    </div>
  );
}
