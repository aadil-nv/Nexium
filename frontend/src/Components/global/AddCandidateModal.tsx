import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { fetchEmployees, addEmployee } from '../../api/managerApi';

const AddCandidateModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]); // Track selected employee IDs

  useEffect(() => {
    if (!isVisible) return;
    setLoading(true);
    fetchEmployees()
      .then(setEmployees)
      .catch(() => toast.error('Failed to fetch employees!'))
      .finally(() => setLoading(false));
  }, [isVisible]);

  const handleFinish = async () => {
    const selectedEmployees = employees.filter((emp: any) => selectedEmployeeIds.includes(emp._id)); // Use _id here

    if (selectedEmployees.length === 0) {
      toast.error('No employees selected!');
      return;
    }

    try {
      // Assuming `addEmployee` API expects an array of employee objects or their IDs
      const success = await addEmployee(selectedEmployees);
      if (success) {
        toast.success(`${selectedEmployees.length} employee(s) added to the department!`);
      } else {
        toast.error('Failed to add employees to the department!');
      }
    } catch (error) {
      toast.error('An error occurred while adding employees!');
    }

    onClose(); // Close the modal after the action is complete
  };

  const handleSelectChange = (value: any) => {
    setSelectedEmployeeIds(value); // Update selected employee IDs
  };

  return (
    <Modal title="Search and Add Employees" open={isVisible} onCancel={onClose} footer={null}>
      {loading ? (
        <Spin tip="Loading employees..." />
      ) : (
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item label="Search and Select Employees" name="employees" rules={[{ required: true, message: 'Please select employees!' }]}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Search and select employees"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              value={selectedEmployeeIds} // Bind selected employee IDs to value
              onChange={handleSelectChange} // Track changes
              options={employees.map((emp) => ({
                value: emp._id, // Use _id instead of id
                label: `${emp.name} (${emp.position})`,
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
