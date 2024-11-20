import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import useTheme from '../../hooks/useTheme';

const Securitie = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { themeColor } = useTheme();

  const inputFields = [
    { label: 'Company Email', name: 'email', placeholder: 'Enter company email', type: 'email', initialValue: 'demo@company.com' },
    { label: 'Password', name: 'password', placeholder: 'Enter your password', type: 'password', initialValue: 'password123' }
  ];

  const handleSubmit = (values: any) => {
    console.log('Submitted values:', values);
    message.success('Security settings updated successfully!');
  };

  const handleForgotPassword = () => message.info('Password reset instructions sent to your email.');

  return (
    <div className="mt-6">
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={inputFields.reduce((acc, { name, initialValue }) => ({ ...acc, [name]: initialValue }), {})}
        className="mt-4"
      >
        {inputFields.map(({ label, name, placeholder, type }) => (
          <Form.Item
            key={name}
            label={label}
            name={name}
            rules={[
              { required: true, message: `Please enter your ${label.toLowerCase()}!` },
              ...(type === 'email' ? [{ type: 'email' as 'email', message: 'Please enter a valid email!' }] : []),
              ...(type === 'password' ? [{ min: 6, message: 'Password must be at least 6 characters long' }] : [])
            ]}
          >
            {type === 'password' ? 
              <Input.Password placeholder={placeholder} disabled={!isEditing} style={{ borderColor: themeColor }} /> : 
              <Input placeholder={placeholder} disabled={!isEditing} style={{ borderColor: themeColor }} />
            }
          </Form.Item>
        ))}

        {isEditing && (
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: themeColor, borderColor: themeColor }}>
              Save Changes
            </Button>
          </Form.Item>
        )}
      </Form>

      <Button onClick={() => setIsEditing(!isEditing)} className="mt-3 text-white" style={{ backgroundColor: themeColor, borderColor: themeColor }}>
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
