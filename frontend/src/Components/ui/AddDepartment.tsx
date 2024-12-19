import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { toast } from 'react-toastify';
import { managerInstance } from '../../services/managerInstance';
import { fetchEmployeesWithOutDepAPI } from '../../api/managerApi';

const AddDepartmentModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onAddDepartment: (department: any) => void;
}> = ({ isVisible, onClose, onAddDepartment }) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetchEmployeesWithOutDepAPI().then(setEmployees).catch(console.error);
  }, []);

  const handleSubmit = async (values: any) => {
    const employeesToAdd = values.employees
      .map((id: string) => employees.find((e) => e._id === id))
      .filter(Boolean)
      .map((emp: any) => ({
        employeeId: emp._id, 
        name: emp.employeeName || 'No Name', 
        position: emp.position || 'No Position', 
        isActive: emp.isOnline, 
        profilePicture: emp.profilePicture || '' 
      }));

    if (!employeesToAdd.length) {
      toast.error('No valid employees selected');
      return;
    }

    try {
      const response = await managerInstance.post(
        '/manager/api/department/add-departments',
        { departmentName: values.departmentName, employees: employeesToAdd }
      );

      if (response.status === 200) {
        toast.success('Department added successfully!');
        onAddDepartment(response.data);
        form.resetFields();
        onClose();
        fetchEmployeesWithOutDepAPI().then(setEmployees).catch(console.error);
      }
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error(error.message);
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
            value: emp._id, label: emp.employeeName
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
