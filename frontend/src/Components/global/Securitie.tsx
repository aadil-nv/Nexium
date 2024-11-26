import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, List } from 'antd';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { managerInstance } from '../../services/managerInstance';

const Securitie = () => {
  const [credentials, setCredentials] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { themeColor } = useTheme();
  const { employee, manager } = useAuth();
  const isManager = manager?.isAuthenticated;
  const isEmployee = employee?.isAuthenticated;

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const url = isManager
          ? '/manager/api/manager/get-managercredentials'
          : isEmployee
          ? 'http://localhost:3000/employee/api/employeee/get-employeecredentials'
          : null;

        if (!url) {
          message.error('Unauthorized access');
          return;
        }

        const response = await managerInstance.get(url);
        console.log('Fetched Credentials:', response.data);
        setCredentials(response.data);
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
      {credentials ? (
        <div>
          <List
            bordered
            dataSource={[credentials]}
            renderItem={(cred) => (
              <List.Item>
                <div>
                  <p>
                    <strong>Company Email:</strong> {cred.companyEmail}
                  </p>
                  <p>
                    <strong>Password:</strong> {cred.companyPassword}
                  </p>
                  {cred.documentUrl && (
                    <div>
                      <img
                        src={cred.documentUrl}
                        alt="Document"
                        style={{ maxWidth: 100, display: 'block', margin: '10px 0' }}
                      />
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      ) : (
        <p>Loading credentials...</p>
      )}

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
            placeholder="Enter company email"
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
              block
              style={{ backgroundColor: themeColor, borderColor: themeColor }}
            >
              Save Changes
            </Button>
          </Form.Item>
        )}
      </Form>

      <Button
        onClick={() => setIsEditing(!isEditing)}
        className="mt-3 text-white"
        style={{ backgroundColor: themeColor, borderColor: themeColor }}
      >
        Edit Security Settings
      </Button>

      <div className="mt-6">
        <Button type="link" onClick={handleForgotPassword} style={{ color: themeColor }}>
          Forgot Password?
        </Button>
      </div>
    </div>
  );
};

export default Securitie;
