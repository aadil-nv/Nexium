import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { fetchEmployees } from '../../api/managerApi';

const AddCandidateModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    setLoading(true);
    fetchEmployees()
      .then(setEmployees)
      .catch(() => toast.error('Failed to fetch employees!'))
      .finally(() => setLoading(false));
  }, [isVisible]);

  const handleFinish = ({ employees: selectedEmployeeIds }: any) => {
    const selectedEmployees = employees.filter((emp: any) => selectedEmployeeIds.includes(emp.id));
    toast[selectedEmployees.length > 0 ? 'success' : 'error'](
      `${selectedEmployees.length} employee(s) ${selectedEmployees.length > 0 ? 'selected' : 'not selected'}!`
    );
    onClose();
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
              showSearch
              placeholder="Search and select employees"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={employees.map((emp) => ({
                value: emp.id,
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
