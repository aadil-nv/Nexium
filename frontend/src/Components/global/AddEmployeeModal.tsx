import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { addEmployee } from '../../api/managerApi';
import { addEmployeeSchema } from '../../config/validationSchema';


const { Option } = Select;

const AddEmployeeModal: React.FC<{isVisible: boolean;onClose: () => void;onManagerAdded: (newManager: { name: string; position: string; email: string; phoneNumber: string; joiningDate: string; salary: number; workTime: string; } ) => void}> = ({ isVisible, onClose, onManagerAdded }) => {
  const [formData, setFormData] = useState({
    name: '', position: '', email: '', phoneNumber: '',
    joiningDate: '', salary: 0, workTime: '',
  });
  const [form] = useForm();

  const fields = [
    { id: 'name', label: 'Employee Name', type: 'text' },
    { id: 'position', label: 'Position', type: 'select', options: ["Team Lead", "Senior Software Engineer", "Junior Software Engineer"] },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { id: 'joiningDate', label: 'Date of Join', type: 'date' },
    { id: 'salary', label: 'Salary', type: 'number' },
    { id: 'workTime', label: 'Work Time', type: 'select', options: ["Full-Time", "Part-Time", "Contract", "Temporary"] },
  ];

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue();
    const validation = addEmployeeSchema.safeParse(formValues);
  
    if (validation.success) {
      const employeeData = { 
        ...formValues, 
        salary: Number(formValues.salary) 
      };
      
      try {
        const response = await addEmployee(employeeData);
        if (response) { // Assuming addEmployee returns the created employee data
          setFormData({ 
            name: '', 
            position: '', 
            email: '', 
            phoneNumber: '', 
            joiningDate: '', 
            salary: 0, 
            workTime: '' 
          });
          onManagerAdded(employeeData); // Pass the employee data instead of the boolean
          onClose();
        }
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    } else {
      form.setFields(
        validation.error.errors.map(err => ({ 
          name: err.path[0], 
          errors: [err.message] 
        }))
      );
    }
  };

  return (
    <Modal title="Add Employee" open={isVisible} onOk={onClose} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleSubmit}>
        {fields.map(({ id, label, type, options }) => (
          <Form.Item
            key={id}
            label={label}
            name={id}
            rules={[{ required: true, message: `Please input ${label.toLowerCase()}!` }]}
          >
            {type === 'select' ? (
              <Select placeholder={`Select ${label}`} onChange={value => setFormData({ ...formData, [id]: value })}>
                {options?.map(option => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            ) : type === 'date' ? (
              <DatePicker style={{ width: '100%' }} onChange={date => setFormData({ ...formData, [id]: date })} />
            ) : (
              <Input
                type={type}
                placeholder={`Enter ${label}`}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;
