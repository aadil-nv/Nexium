import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';

export default function Address() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const { themeColor } = useTheme();

  const initialValues = {
    street: '123 Main St',
    city: 'Demo City',
    state: 'Demo State',
    country: 'Demo Country',
    zip: '12345',
  };

  const fields = ['street', 'city', 'state', 'country', 'zip'];

  const onFinish = (values: any) => console.log('Form values:', values);

  return (
    <div className="mt-6">
      <Form form={form} onFinish={onFinish} layout="vertical" initialValues={initialValues} className="mt-4">
        {fields.map((field) => (
          <Form.Item key={field} name={field} label={field.charAt(0).toUpperCase() + field.slice(1)} rules={[{ required: true, message: `Please enter your ${field}` }]}>
            <Input placeholder={`Enter your ${field}`} disabled={!isEditing} />
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

      <Button
        icon={<EditOutlined />}
        onClick={() => setIsEditing(!isEditing)}
        className="mt-3 text-white"
        style={{ backgroundColor: themeColor, borderColor: themeColor }}
      >
        Edit Address
      </Button>
    </div>
  );
}
