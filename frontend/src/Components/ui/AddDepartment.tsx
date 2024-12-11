import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { toast } from 'react-toastify'; // For notifications
import axios from 'axios'; // Axios for API requests
import { managerInstance } from '../../services/managerInstance';

const { Option } = Select;

const AddDepartmentModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onAddDepartment: (department: any) => void;
  employees: any[];
}> = ({ isVisible, onClose, onAddDepartment, employees }) => {
  const [form] = Form.useForm();
  
  console.log("employees8888888888888888888", employees);

  const handleSubmit = async (values: any) => {
    console.log('Form values:', values);  // Log the form values to ensure it's correct

    try {
      // Ensure that selected employees are mapped correctly
      const employeesToAdd = values.employees
        .map((id: string) => {
          // Find employee based on _id, which is the unique identifier
          const employee = employees.find((e) => e._id === id);
          if (!employee) {
            console.error(`Employee with id ${id} not found`);
            return null;
          }
          // Return an object with employee id and name
          return { 
            _id: employee._id, 
            name: employee.employeeName || 'No Name', 
            position: employee.position || 'No Position', 
            isActive: employee.isActive, 
            profilePicture: employee.profilePicture || '' 
          };
        })
        .filter((emp) => emp !== null); // Remove any invalid employees

      if (employeesToAdd.length === 0) {
        toast.error('No valid employees selected');
        return;
      }

      // Make the API call to add the department
      const response = await managerInstance.post(
        '/manager/api/department/add-departments',
        {
          departmentName: values.departmentName,
          employees: employeesToAdd,
        }
      );

      if (response.status === 200) {
        toast.success('Department added successfully!');
        onAddDepartment(response.data);  // Pass the newly added department to update state
        onClose();  // Close the modal
      }
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Modal
      title="Add Department"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ departmentName: '', employees: [] }}
      >
        {/* Input for Department Name */}
        <Form.Item
          label="Department Name"
          name="departmentName"
          rules={[ 
            { required: true, message: 'Please input the department name!' },
            { min: 3, message: 'Department name must be at least 3 characters long!' }
          ]}
        >
          <Input placeholder="Enter department name" />
        </Form.Item>

        {/* Select for Employees */}
        <Form.Item
          label="Select Employees"
          name="employees"
          rules={[{ required: true, message: 'Please select employees!' }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Search and select employees"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={employees.map((emp) => ({
              value: emp._id, // Use the employee's unique _id
              label: `${emp.employeeName || 'Unknown Employee'}`, // Use employee name as label
            }))}
          />
        </Form.Item>

        {/* Submit Button */}
        <Button type="primary" htmlType="submit" block>
          Add Department
        </Button>
      </Form>
    </Modal>
  );
};

export default AddDepartmentModal;
