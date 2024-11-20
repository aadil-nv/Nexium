import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useTheme from '../../hooks/useTheme';

export default function ProfessionalDetails() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const { themeColor } = useTheme();

  const initialValues = {
    position: 'Software Engineer',
    department: 'IT',
    workTime: 'Full-Time',
    joiningDate: dayjs('2022-01-01'),
    currentStatus: 'Active',
    companyName: 'Demo Company',
    salary: '50000',
    skills: 'JavaScript, React, Node.js',
  };

  const fields = [
    { name: 'position', label: 'Position' },
    { name: 'department', label: 'Department' },
    { name: 'workTime', label: 'Work Time' },
    { name: 'currentStatus', label: 'Current Status' },
    { name: 'companyName', label: 'Company Name' },
    { name: 'salary', label: 'Salary' },
    { name: 'skills', label: 'Skills' },
  ];

  const onFinish = (values: any) => console.log('Form values:', values);

  return (
    <div className="mt-6">
      <Form form={form} onFinish={onFinish} layout="vertical" initialValues={initialValues} className="mt-4">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {fields.slice(0, 4).map((field) => (
              <Form.Item key={field.name} name={field.name} label={field.label} rules={[{ required: true, message: `Please enter your ${field.label.toLowerCase()}` }]}>
                <Input placeholder={`Enter your ${field.label.toLowerCase()}`} disabled={!isEditing} />
              </Form.Item>
            ))}
          </Col>
          <Col xs={24} sm={12}>
            {fields.slice(4).map((field) => (
              <Form.Item key={field.name} name={field.name} label={field.label} rules={[{ required: true, message: `Please enter your ${field.label.toLowerCase()}` }]}>
                <Input placeholder={`Enter your ${field.label.toLowerCase()}`} disabled={!isEditing} />
              </Form.Item>
            ))}
            <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true, message: 'Please select your joining date' }]}>
              <DatePicker style={{ width: '100%' }} disabled value={dayjs('2022-01-01')} placeholder="Select your joining date" />
            </Form.Item>
          </Col>
        </Row>

        {isEditing && (
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: themeColor, borderColor: themeColor }}>
              Save Changes
            </Button>
          </Form.Item>
        )}
      </Form>

      <Button
        icon={<EditOutlined />}
        onClick={() => setIsEditing(!isEditing)}
        className="mt-3 text-white"
        style={{ backgroundColor: themeColor, borderColor: themeColor }}
      >
        Edit Details
      </Button>
    </div>
  );
}
