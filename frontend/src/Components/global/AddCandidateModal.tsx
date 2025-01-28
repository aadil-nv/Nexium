import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { fetchEmployeesWithOutDepartment, addEmployeeToDepartment } from '../../api/managerApi';
import { IEmployee } from '../../interface/managerInterface';

interface AddCandidateModalProps {
  isVisible: boolean;
  onClose: () => void;
  departmentId: string;
  onEmployeesAdded: (newEmployees: IEmployee[]) => void;
}

type AddEmployeeToDepartmentFunction = (
  employees: IEmployee[],
  departmentId: string
) => Promise<boolean>;

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ 
  isVisible, 
  onClose, 
  departmentId, 
  onEmployeesAdded 
}) => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) return;
    setLoading(true);
    fetchEmployeesWithOutDepartment()
      .then((fetchedEmployees: IEmployee[]) => setEmployees(fetchedEmployees))
      .catch(() => toast.error('Failed to fetch employees!'))
      .finally(() => setLoading(false));
  }, [isVisible]);

  const handleFinish = async () => {
    const selectedEmployees = employees.filter((emp) => 
      selectedEmployeeIds.includes(emp.employeeId || '')
    );

    if (selectedEmployees.length === 0) {
      toast.error('No employees selected!');
      return;
    }

    try {
      // Cast the function to the correct type
      const addToDepartment = addEmployeeToDepartment as AddEmployeeToDepartmentFunction;
      const success = await addToDepartment(selectedEmployees, departmentId);
      
      if (success) {
        toast.success(`${selectedEmployees.length} employee(s) added to the department!`);
        onEmployeesAdded(selectedEmployees);
      } else {
        toast.error('Failed to add employees to the department!');
      }
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const errorMessage = axiosError.response?.data?.message || error.message;
        toast.error(errorMessage || 'An error occurred while adding employees!');
      } else {
        toast.error('An unexpected error occurred while adding employees!');
      }
    }

    onClose();
  };

  const handleSelectChange = (value: string[]) => {
    setSelectedEmployeeIds(value);
  };

  return (
    <Modal
      title="Add Employees to Department"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleFinish}>
          Add Selected
        </Button>
      ]}
    >
      {loading ? (
        <div className="text-center"><Spin /></div>
      ) : (
        <Form>
          <Form.Item label="Select Employees">
            <Select
              mode="multiple"
              placeholder="Select employees"
              filterOption={(input, option) => 
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              value={selectedEmployeeIds}
              onChange={handleSelectChange}
              options={employees.map((emp) => ({
                value: emp.employeeId,
                label: `${emp.name} (${emp.position})`,
              }))}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddCandidateModal;