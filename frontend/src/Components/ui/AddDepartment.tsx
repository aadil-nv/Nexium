import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { toast } from 'react-toastify';
import { managerInstance } from '../../services/managerInstance';
import { fetchEmployeesWithOutDepAPI } from '../../api/managerApi';
import { IDepartment } from '../../interface/managerInterface';
import { AxiosError } from 'axios';

type Employee = {
  employeeId: string;
  employeeName: string;
  email: string;
  position: string;
  isOnline: boolean;
  profilePicture: string;
};

type FormValues = {
  departmentName: string;
  employees: string[];
};

const AddDepartmentModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onAddDepartment: (department: IDepartment) => void;
}> = ({ isVisible, onClose, onAddDepartment }) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployeesWithOutDepAPI()
      .then(setEmployees)
      .catch(console.error);
  }, []);


const handleSubmit = async (values: FormValues) => {
  const employeesToAdd = values.employees
    .map((id: string) => employees.find((e) => e.employeeId === id))
    .filter(Boolean)
    .map((emp) => ({
      employeeId: emp!.employeeId, // Non-null assertion because of filter(Boolean)
      email: emp!.email,
      name: emp!.employeeName,
      position: emp!.position,
      isActive: emp!.isOnline,
      profilePicture: emp!.profilePicture || '',
    }));

  if (!employeesToAdd.length) {
    toast.error('No valid employees selected');
    return;
  }

  try {
    const response = await managerInstance.post(
      '/manager-service/api/department/add-departments',
      { departmentName: values.departmentName, employees: employeesToAdd }
    );

    if (response.status === 200) {
      toast.success('Department added successfully!');
      onAddDepartment(response.data.department);

      form.resetFields();
      onClose();
      fetchEmployeesWithOutDepAPI().then(setEmployees).catch(console.error);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error adding department:', error.response?.data?.message);
      toast.error(error.response?.data?.message);
    } else {
      // Handle unexpected errors
      console.error('An unexpected error occurred:', error);
      toast.error('An unexpected error occurred.');
    }
  }
};


  return (
    <Modal title="Add Department" open={isVisible} onCancel={onClose} footer={null}>
      <Form layout="vertical" form={form} onFinish={handleSubmit} initialValues={{ departmentName: '', employees: [] }}>
        <Form.Item label="Department Name" name="departmentName" rules={[{ required: true, message: 'Please input the department name!' }]}>
          <Input placeholder="Enter department name" />
        </Form.Item>

        <Form.Item label="Select Employees" name="employees" rules={[{ required: true, message: 'Please select employees!' }]}>
          <Select mode="multiple" allowClear placeholder="Search and select employees" options={employees.map((emp) => ({
            value: emp.employeeId, label: `${emp.employeeName} (${emp.position})`,
          }))} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Add Department
        </Button>
      </Form>
    </Modal>
  );
};

export default AddDepartmentModal;
