import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, List } from 'antd';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { managerInstance } from '../../services/managerInstance';
import { employeeInstance } from '../../services/employeeInstance';

const Securitie = () => {
  const [credentials, setCredentials] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { themeColor } = useTheme();
  const { employee, manager } = useAuth();
  const isManager = manager?.isAuthenticated;
  const isEmployee = employee?.isAuthenticated;
  const instance = isManager ? managerInstance : employeeInstance;

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const url = isManager
          ? '/manager/api/manager/get-managercredentials'
          : isEmployee
          ? '/employee/api/employee/get-employeecredentials'
          : null;

        if (!url) {
          message.error('Unauthorized access');
          return;
        }

        const response = await instance.get(url);
        console.log('Fetched Credentials:', response.data);
        isManager ? setCredentials(response.data) : setCredentials(response.data);
      } catch (error) {
        console.error('Error fetching credentials:', error);
        message.error('Failed to fetch credentials');
      }
    };

    fetchCredentials();
  }, [isManager, isEmployee]);

  const handleSubmit = (values: any) => {
    console.log('Submitted values:', values);
    message.success('Security settings updated successfully!');
  };

  const handleForgotPassword = () => message.info('Password reset instructions sent to your email.');

  return (
    <div className="mt-6">
      <h2>Your Credentials</h2>
      
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          email: credentials?.companyEmail || '',
          password: credentials?.companyPassword || '',
        }}
        className="mt-4"
      >
        <Form.Item
          label="Company Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input
            placeholder={credentials?.companyEmail || 'Enter company email'}
            disabled={!isEditing}
            style={{ borderColor: themeColor }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 6, message: 'Password must be at least 6 characters long' },
          ]}
        >
          <Input.Password
            placeholder={credentials?.companyPassword || 'Enter your password'}
            disabled={!isEditing}
            style={{ borderColor: themeColor }}
          />
        </Form.Item>

       
      </Form>

      
      <div className="mt-6">
       
      </div>
    </div>
  );
};

export default Securitie;
