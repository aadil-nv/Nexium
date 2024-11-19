import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import {managerInstance}from "../../services/managerInstance"

const AddCandidateModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await managerInstance.get('/manager/api/employee/get-employees');
        setEmployees(response.data || []); // Set employees data
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to fetch employees!');
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchEmployees();
    }
  }, [isVisible]);

  const handleFinish = (values: any) => {
    const selectedEmployeeIds = values.employees || [];
    const selectedEmployees = employees.filter((emp: any) =>
      selectedEmployeeIds.includes(emp._id)
    );

    if (selectedEmployees.length > 0) {
      toast.success(`${selectedEmployees.length} employee(s) selected successfully!`);
    } else {
      toast.error('No employees selected!');
    }

    onClose(); // Close the modal
  };

  return (
    <Modal
      title="Search and Add Employees"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      {loading ? (
        <Spin tip="Loading employees..." />
      ) : (
        <Form
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="Search and Select Employees"
            name="employees"
            rules={[{ required: true, message: 'Please select employees!' }]}
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Search and select employees"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={employees.map((emp: any) => ({
                value: emp._id,
                label: `${emp.personalDetails.firstName} ${emp.personalDetails.lastName}`,
              }))}
            />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Selected
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default AddCandidateModal;
