import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
// import { z } from 'zod';
import type { Employee } from './EmployeeTypes';
import { businessOwnerInstance } from "../../../services/businessOwnerInstance";

const { Option } = Select;

interface AddEmployeeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (employee: Employee) => void;
}

interface FormData {
  employeeName: string;
  position: NonNullable<Employee['professionalDetails']['position']>;
  email: string;
  phone: string;
  joiningDate: string;
  salary: number;
  workTime: Employee['professionalDetails']['workTime'];
  gender: "Male" | "Female" | "Other";
  department: string;
}

// const addEmployeeSchema = z.object({
//   employeeName: z.string().min(1, "Employee name is required"),
//   position: z.enum(["Team Lead", "Senior Software Engineer", "Junior Software Engineer"]),
//   email: z.string().email("Invalid email format"),
//   phone: z.string().min(10, "Phone number must be at least 10 digits"),
// //   joiningDate: z.date().min( "Joining date is required"),
//   salary: z.string().min(1, "Salary must be greater than 0"),
//   workTime: z.enum(["Full-Time", "Part-Time", "Contract", "Temporary"]),
//   gender: z.enum(["Male", "Female", "Other"]),
//   department: z.string().min(1, "Department is required")
// });

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isVisible,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<FormData>({
    employeeName: '',
    position: "Junior Software Engineer",
    email: '',
    phone: '',
    joiningDate: '',
    salary: 0,
    workTime: "Full-Time",
    gender: "Male",
    department: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const fields = [
    { id: 'employeeName', label: 'Employee Name', type: 'text' },
    { 
      id: 'position', 
      label: 'Position', 
      type: 'select', 
      options: ["Team Lead", "Senior Software Engineer", "Junior Software Engineer"] as const
    },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'phone', label: 'Phone Number', type: 'text' },
    { id: 'joiningDate', label: 'Date of Join', type: 'date' },
    { id: 'salary', label: 'Salary', type: 'number' },
    { 
      id: 'workTime', 
      label: 'Work Time', 
      type: 'select', 
      options: ["Full-Time", "Part-Time", "Contract", "Temporary"] as const
    },
  ];

  const handleSubmit = async () => {
    console.log("calling handleSubmit ===> ", formData);
    
    try {
      setLoading(true);
      const formValues = form.getFieldsValue();
    //   const validation = addEmployeeSchema.safeParse(formValues);

    //   if (!validation.success) {
    //     form.setFields(
    //       validation.error.errors.map(err => ({
    //         name: err.path[0],
    //         errors: [err.message]
    //       }))
    //     );
    //     return;
    //   }

      const employeeData = {
        ...formValues,
        salary: Number(formValues.salary)
      };

      const newEmployee: Employee = {
        _id: Date.now().toString(),
        managerId: '',
        businessOwnerId: '',
        isActive: true,
        isVerified: false,
        isBlocked: false,
        role: 'employee',
        personalDetails: {
          profilePicture: '',
          employeeName: employeeData.employeeName,
          email: employeeData.email,
          phone: employeeData.phone,
          personalWebsite: '',
          bankAccountNumber: '',
          ifscCode: '',
          aadharNumber: '',
          panNumber: '',
          gender: employeeData.gender
        },
        professionalDetails: {
          position: employeeData.position,
          department: employeeData.department,
          workTime: employeeData.workTime,
          joiningDate: new Date(employeeData.joiningDate),
          currentStatus: 'Active',
          salary: employeeData.salary,
          uanNumber: '',
          pfAccount: '',
          esiAccount: ''
        },
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        employeeCredentials: {
          companyEmail: '',
          companyPassword: ''
        }
      };

      // Send data to backend
      const response = await businessOwnerInstance.post(
        '/businessOwner-service/api/employee/add-employee',
        newEmployee
      );

      if (response.status === 200 || response.status === 201) {
        message.success('Employee added successfully');
        onAdd(response.data);
        onClose();
        form.resetFields();
        setFormData({
          employeeName: '',
          position: "Junior Software Engineer",
          email: '',
          phone: '',
          joiningDate: '',
          salary: 0,
          workTime: "Full-Time",
          gender: "Male",
          department: ''
        });
      } else {
        message.error('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      // message.error('Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      title="Add Employee" 
      open={isVisible} 
      onCancel={onClose} 
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        {fields.map(({ id, label, type, options }) => (
          <Form.Item
            key={id}
            label={label}
            name={id}
            rules={[{ required: true, message: `Please input ${label.toLowerCase()}!` }]}
          >
            {type === 'select' ? (
              <Select 
                placeholder={`Select ${label}`}
                onChange={value => setFormData(prev => ({ ...prev, [id]: value }))}
              >
                {options?.map(option => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            ) : type === 'date' ? (
              <DatePicker 
                style={{ width: '100%' }} 
                onChange={(date, dateString) => 
                  setFormData(prev => ({ ...prev, [id]: dateString }))
                } 
              />
            ) : (
              <Input
                type={type}
                placeholder={`Enter ${label}`}
                onChange={e => 
                  setFormData(prev => ({ ...prev, [id]: e.target.value }))
                }
              />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;