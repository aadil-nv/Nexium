import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { managerInstance } from '../../services/managerInstance';

export default function ProfessionalDetails() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>({});
  const { themeColor } = useTheme();
  const { employee, manager } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = manager.isAuthenticated
          ? await managerInstance.get('/manager/api/manager/get-managerprofessionalinfo')
          : employee.isAuthenticated
          ? await axios.get('http://localhost:3000/employee/api/employeee/get-employeeprofessianl')
          : null;

        if (response?.data) {
          setDetails(response.data);
          form.setFieldsValue({ ...response.data, joiningDate: dayjs(response.data.joiningDate) });
        }
      } catch {
        message.error('Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [manager.isAuthenticated, employee.isAuthenticated]);

  console.log('Details:===============', details);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-6">
      <Form form={form} layout="vertical" initialValues={details} className="mt-4">
        <Row gutter={16}>
          {[
            { name: 'managerType', label: 'Position' },
            { name: 'workTime', label: 'Work Time' },
            { name: 'salary', label: 'Salary' },
          ].map((field) => (
            <Col key={field.name} xs={24} sm={12}>
              <Form.Item name={field.name} label={field.label} rules={[{ required: true }]}>
                <Input placeholder={`Enter ${field.label.toLowerCase()}`} disabled />
              </Form.Item>
            </Col>
          ))}
          <Col xs={24} sm={12}>
            <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
