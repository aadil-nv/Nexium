import { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import useAuth from '../../hooks/useAuth';
import { managerInstance } from '../../services/managerInstance';
import { employeeInstance } from '../../services/employeeInstance';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

// Define interfaces for different types of professional details
interface EmployeeProfessionalDetails {
  position: string;
  department: string;
  workTime: string;
  joiningDate: string;
  currentStatus: string;
  companyName: string;
  salary: number;
  uanNumber: string;
  pfAccount: string;
  esiAccount: string;
}

interface ManagerProfessionalDetails {
  managerType: string;
  workTime: string;
  joiningDate: string;
  salary: number;
}

// Define a union type for fields
type ProfessionalField = {
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'uanNumber' | 'pfAccount' | 'esiAccount';
};

export default function ProfessionalDetails() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const { employee, manager, businessOwner } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = manager.isAuthenticated
          ? await managerInstance.get<ManagerProfessionalDetails>('/manager-service/api/manager/get-managerprofessionalinfo')
          : employee.isAuthenticated
          ? await employeeInstance.get<EmployeeProfessionalDetails>('/employee-service/api/employee/get-employeeprofessionalinfo')
          : businessOwner.isAuthenticated
          ? await businessOwnerInstance.get<EmployeeProfessionalDetails>('/businessOwner-service/api/business-owner/get-businessownerprofessionalinfo')
          : null;
  
        if (response?.data) {
          // Optional: Add a console log or use the details if needed
          console.log(response.data);
          
          form.setFieldsValue({
            ...response.data,
            joiningDate: dayjs(response.data.joiningDate),
          });
        }
      } catch {
        message.error('Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [manager.isAuthenticated, employee.isAuthenticated, businessOwner.isAuthenticated, form]);
  if (loading) return <div>Loading...</div>;

  const employeeFields: ProfessionalField[] = [
    { name: 'position', label: 'Position', type: 'text' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'workTime', label: 'Work Time', type: 'text' },
    { name: 'joiningDate', label: 'Joining Date', type: 'date' },
    { name: 'currentStatus', label: 'Current Status', type: 'text' },
    { name: 'companyName', label: 'Company Name', type: 'text' },
    { name: 'salary', label: 'Salary', type: 'number' },
    { name: 'uanNumber', label: 'UAN NO', type: 'uanNumber' },
    { name: 'pfAccount', label: 'PF a/c', type: 'pfAccount' },
    { name: 'esiAccount', label: 'ESI a/c', type: 'esiAccount' },
  ];

  const managerFields: ProfessionalField[] = [
    { name: 'managerType', label: 'Manager Type', type: 'text' },
    { name: 'workTime', label: 'Work Time', type: 'text' },
    { name: 'joiningDate', label: 'Joining Date', type: 'date' },
    { name: 'salary', label: 'Salary', type: 'number' },
  ];

  const fieldsToRender = employee.isAuthenticated
    ? employeeFields
    : manager.isAuthenticated
    ? managerFields
    : [];

    return (
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {fieldsToRender.map((field) => (
            <Col key={field.name} span={8}>
              {field.type === 'date' ? (
                <Form.Item name={field.name} label={field.label}>
                  <DatePicker style={{ width: '100%' }} disabled />
                </Form.Item>
              ) : field.type === 'number' ? (
                <Form.Item name={field.name} label={field.label}>
                  <Input type="number" disabled />
                </Form.Item>
              ) : (
                <Form.Item name={field.name} label={field.label}>
                  <Input disabled />
                </Form.Item>
              )}
            </Col>
          ))}
        </Row>
      </Form>
    );
}