import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { fetchBusinessOwnerAddress } from '../../api/businessOwnerApi';
import { fetchManagerAddress } from '../../api/managerApi';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

const Address = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({street: '', city: '', state: '', country: '', postalCode: ''});

  const { themeColor } = useTheme();
  const { businessOwner, manager, employee, superAdmin } = useAuth();
  const isActiveUser = [businessOwner, manager, employee, superAdmin].some(user => user.isAuthenticated);

  useEffect(() => {
    if (businessOwner.isAuthenticated) {
      (async () => {
        try {
          const { street, city, state, country, postalCode } = await fetchBusinessOwnerAddress();
          const mappedData = { street: street, city, state, country,  postalCode };
          setAddress(mappedData);
          form.setFieldsValue(mappedData);
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      })();
    }else if(manager.isAuthenticated){
      (async () => {
        try {
          const { street, city, state, country, postalCode } = await fetchManagerAddress();
          const mappedData = { street: street, city, state, country, postalCode };
          setAddress(mappedData);
          form.setFieldsValue(mappedData);
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      })();
    }
  }, [businessOwner.isAuthenticated,manager.isAuthenticated, form]);

  const onFinish = async (values: any) => {
    console.log('Form values:', values);
    if (businessOwner.isAuthenticated) {
      try {
        const response = await businessOwnerInstance.post(
          "/businessOwner/api/business-owner/update-address",
          values
        );
        console.log('Address updated successfully:', response.data);
        setIsEditing(false); // Exit edit mode
        setAddress(values); // Update state with new values
      } catch (error) {
        console.error('Error updating address:', error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="mt-6">
      <Form form={form} onFinish={onFinish} layout="vertical" className="mt-4">
        {['street', 'city', 'state', 'country', 'postalCode'].map(field => (
          <Form.Item
            key={field}
            name={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            rules={[{ required: true, message: `Please enter your ${field}` }]}
          >
            <Input placeholder={address[field] || `Enter your ${field}`} disabled={!isEditing} />
          </Form.Item>
        ))}
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
        Edit Address
      </Button>
    </div>
  );
};

export default Address;
