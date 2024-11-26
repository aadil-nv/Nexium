import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { managerInstance } from '../../services/managerInstance';

export default function ProfessionalDetails() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { themeColor } = useTheme();
  const { employee, manager } = useAuth();
  const isManager = manager.isAuthenticated;
  const isEmployee = employee.isAuthenticated;
  const [professionalDetails, setProfessionalDetails] = useState({}); // Initialize as an empty object

  const fetchProfessionalDetails = async () => {
    try {
      let response;
      if (isManager) {
        response = await managerInstance.get('/manager/api/manager/get-managerprofessionalinfo');
      } else if (isEmployee) {
        response = await axios.get('http://localhost:3000/employee/api/employeee/get-employeeprofessianl');
      }
      console.log("------------respose------------",response.data)

      if (response?.data) {
        console.log("hited--------------------------")
        setProfessionalDetails(response.data);

        // Set form fields with fetched data
        form.setFieldsValue({
          ...response.data,
          joiningDate: dayjs(response.data.joiningDate),
        });
      }

      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch professional details');
      console.error('Error fetching professional details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionalDetails();
  }, [isManager, isEmployee]);
  console.log("")

  const fields = [
    { name: 'managerType', label: 'Position' },
    { name: 'workTime', label: 'Work Time' },
    { name: 'salary', label: 'Salary' },
  ];

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    message.success('Details updated successfully!');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-6">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={professionalDetails}
        className="mt-4"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {fields.slice(0, 4).map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[
                  {
                    required: true,
                    message: `Please enter your ${field.label.toLowerCase()}`,
                  },
                ]}
              >
                <Input
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  disabled={!isEditing}
                />
              </Form.Item>
            ))}
          </Col>
          <Col xs={24} sm={12}>
            {fields.slice(4).map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[
                  {
                    required: true,
                    message: `Please enter your ${field.label.toLowerCase()}`,
                  },
                ]}
              >
                <Input
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  disabled={!isEditing}
                />
              </Form.Item>
            ))}
            <Form.Item
              name="joiningDate"
              label="Joining Date"
              rules={[
                { required: true, message: 'Please select your joining date' },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabled={!isEditing}
                placeholder="Select your joining date"
              />
            </Form.Item>
          </Col>
        </Row>

        {isEditing && (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: themeColor, borderColor: themeColor }}
            >
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
        {isEditing ? 'Cancel' : 'Edit Details'}
      </Button>
    </div>
  );
}
