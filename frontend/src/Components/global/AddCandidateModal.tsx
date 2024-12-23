import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { fetchEmployeesWithOutDepartment, addEmployeeToDepartment } from '../../api/managerApi';

interface AddCandidateModalProps {
  isVisible: boolean;
  onClose: () => void;
  departmentId: string;
  onEmployeesAdded: (newEmployees: any[]) => void;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ 
  isVisible, 
  onClose, 
  departmentId,
  onEmployeesAdded 
}) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) return;
    setLoading(true);
    fetchEmployeesWithOutDepartment()
      .then(setEmployees)
      .catch(() => toast.error('Failed to fetch employees!'))
      .finally(() => setLoading(false));
  }, [isVisible]);

  console.log("employees--------------222222222222222222",employees);
  

  const handleFinish = async () => {
    const selectedEmployees = employees.filter((emp: any) => selectedEmployeeIds.includes(emp._id,emp.profilePicture));

    if (selectedEmployees.length === 0) {
      toast.error('No employees selected!');
      return;
    }

    try {
      const success = await addEmployeeToDepartment(selectedEmployees, departmentId);
      if (success) {
        toast.success(`${selectedEmployees.length} employee(s) added to the department!`);
        onEmployeesAdded(selectedEmployees); // Update parent component
      } else {
        toast.error('Failed to add employees to the department!');
      }
    } catch (error) {
      toast.error('An error occurred while adding employees!');
    }

    onClose();
  };

  const handleSelectChange = (value: any) => {
    setSelectedEmployeeIds(value);
  };

  return (
    <Modal title="Search and Add Employees" open={isVisible} onCancel={onClose} footer={null}>
      {loading ? (
        <Spin tip="Loading employees..." />
      ) : (
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item 
            label="Search and Select Employees" 
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
              value={selectedEmployeeIds}
              onChange={handleSelectChange}
              options={employees.map((emp) => ({
                value: emp._id,
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
