import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export default function Address() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false); 

  const initialValues = {
    street: '123 Main St',
    city: 'Demo City',
    state: 'Demo State',
    country: 'Demo Country',
    zip: '12345',
  };

  const onFinish = (values: any) => console.log('Form values:', values);

  return (
    <div className="mt-6">

      
      <Form form={form} onFinish={onFinish} layout="vertical" initialValues={initialValues} className="mt-4">
        {['street', 'city', 'state', 'country', 'zip'].map((field) => (
          <Form.Item
            key={field}
            name={field}
            label={field.replace(/([A-Z])/g, ' $1').toUpperCase()}
            rules={[{ required: true, message: `Please enter your ${field.toLowerCase()}` }]}
          >
            <Input
              placeholder={`Enter your ${field.toLowerCase()}`}
              disabled={!isEditing} 
            />
          </Form.Item>
        ))}
        
        {isEditing && (
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Save Changes</Button>
          </Form.Item>
        )}
      </Form>

      {!isEditing && (
        <Button icon={<EditOutlined />} onClick={() => setIsEditing(!isEditing)} className="mt-3">
          Edit Address
        </Button>
      )}
    </div>
  );
}
