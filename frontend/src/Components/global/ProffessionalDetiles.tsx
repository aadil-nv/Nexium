import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import useAuth from '../../hooks/useAuth';
import { managerInstance } from '../../services/managerInstance';
import { employeeInstance } from '../../services/employeeInstance';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

export default function ProfessionalDetails() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>({});
  const { employee, manager, businessOwner } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = manager.isAuthenticated
          ? await managerInstance.get('/manager/api/manager/get-managerprofessionalinfo'): employee.isAuthenticated
          ? await employeeInstance.get('/employee/api/employee/get-employeeprofessionalinfo'): businessOwner.isAuthenticated
          ? await businessOwnerInstance.get('/businessOwner/api/business-owner/get-businessownerprofessionalinfo'): null;

        if (response?.data) {
          setDetails(response.data);
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
  }, [manager.isAuthenticated, employee.isAuthenticated, businessOwner.isAuthenticated]);

  if (loading) return <p>Loading...</p>;

  const employeeFields = [
    { name: 'position', label: 'Position', type: 'text' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'workTime', label: 'Work Time', type: 'text' },
    { name: 'joiningDate', label: 'Joining Date', type: 'date' },
    { name: 'currentStatus', label: 'Current Status', type: 'text' },
    { name: 'companyName', label: 'Company Name', type: 'text' },
    { name: 'salary', label: 'Salary', type: 'number' },
  ];

  const managerFields = [
    { name: 'managerType', label: 'Manager Type', type: 'text' },
    { name: 'workTime', label: 'Work Time', type: 'text' },
    { name: 'joiningDate', label: 'Joining Date', type: 'date' },
    { name: 'salary', label: 'Salary', type: 'number' },
  ];



  const fieldsToRender = employee.isAuthenticated? employeeFields: manager.isAuthenticated ? managerFields: [];
    
  

  return (
    <div className="mt-6">
      <Form
        form={form}
        layout="vertical"
        initialValues={details}
        className="mt-4"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <Row gutter={16}>
          {fieldsToRender.map((field) => (
            <Col key={field.name} xs={24} sm={12}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={[{ required: true, message: `Please enter ${field.label.toLowerCase()}` }]}
              >
                {field.type === 'date' ? (
                  <DatePicker style={{ width: '100%' }} disabled />
                ) : field.type === 'number' ? (
                  <Input type="number" placeholder={`Enter ${field.label}`} disabled />
                ) : (
                  <Input placeholder={`Enter ${field.label}`} disabled />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </div>
  );
}
