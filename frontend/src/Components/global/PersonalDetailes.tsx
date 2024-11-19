import React, { useState } from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined } from '@ant-design/icons';
import CardImage from './CardImage'; 

export default function PersonalDetails() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false); 

  const initialValues = {
    companyName: 'Demo Company',
    businessOwnerName: 'John Doe',
    email: 'demo@company.com',
    phoneNumber: '123-456-7890',
    websiteLink: 'https://demo.com',
  };

  const onFinish = (values: any) => console.log('Form values:', values);

  const handleProfilePictureChange = (info: any) => {
    if (info.file.status === 'done') console.log('Profile picture uploaded:', info.file);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 pt-[60px] flex justify-center md:justify-start">
        <div className="space-y-6 w-[80%]">
          <CardImage title="Profile Image" imgSrc="https://via.placeholder.com/150" />
          <CardImage title="Company Logo" imgSrc="https://via.placeholder.com/150" />
          <Upload action="/upload" showUploadList={false} onChange={handleProfilePictureChange} />
        </div>
      </div>

      <div className="flex-1 md:pt-0">
        <Form form={form} onFinish={onFinish} layout="vertical" initialValues={initialValues} className="mt-6">
          {['companyName', 'businessOwnerName', 'email', 'phoneNumber', 'websiteLink'].map((field) => (
            <Form.Item
              key={field}
              name={field}
              label={field.replace(/([A-Z])/g, ' $1').toUpperCase()}
              rules={[{ required: true, message: `Please enter your ${field.toLowerCase()}` }]}
            >
              <Input
                prefix={field === 'email' ? <MailOutlined /> : field === 'phoneNumber' ? <PhoneOutlined /> : <UserOutlined />}
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
            Edit Details
          </Button>
        )}
      </div>
    </div>
  );
}
