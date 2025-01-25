import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { managerInstance } from '../../services/managerInstance';
import { employeeInstance } from '../../services/employeeInstance';

// Define interface for Credentials
interface Credentials {
  companyEmail: string;
  companyPassword: string;
}

const Securities: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { themeColor } = useTheme();
  const { employee, manager } = useAuth();
  const isManager = manager?.isAuthenticated;
  const isEmployee = employee?.isAuthenticated;
  const instance = isManager ? managerInstance : employeeInstance;

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const url = isManager
          ? '/manager-service/api/manager/get-managercredentials'
          : isEmployee
          ? '/employee-service/api/employee/get-employeecredentials'
          : null;

        if (!url) {
          message.error('Unauthorized access');
          return;
        }

        const response = await instance.get<Credentials>(url);
        setCredentials(response.data);
      } catch (error) {
        console.error('Error fetching credentials:', error);
        message.error('Failed to fetch credentials');
      }
    };

    fetchCredentials();
  }, [isManager, isEmployee, instance]);

  const handleSubmit = async (values: Credentials) => {
    try {
      const url = isManager
        ? '/manager-service/api/manager/update-managercredentials'
        : '/employee-service/api/employee/update-employeecredentials';

      await instance.post(url, values);
      message.success('Security settings updated successfully!');
      setIsEditing(false);
      setCredentials(values);
    } catch (error) {
      console.error('Error updating credentials:', error);
      message.error('Failed to update credentials');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Credentials</h2>
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          style={{ backgroundColor: themeColor, color: 'white' }}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          companyEmail: credentials?.companyEmail || '',
          companyPassword: credentials?.companyPassword || '',
        }}
        className="mt-4"
      >
        <Form.Item
          label="Company Email"
          name="companyEmail"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input
            placeholder="Enter company email"
            disabled={!isEditing}
            style={{ borderColor: themeColor }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="companyPassword"
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 6, message: 'Password must be at least 6 characters long' },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            disabled={!isEditing}
            style={{ borderColor: themeColor }}
          />
        </Form.Item>

        {isEditing && (
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ backgroundColor: themeColor }}
            >
              Save Changes
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default Securities;