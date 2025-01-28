import { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { fetchBusinessOwnerAddress, updateBusinessOwnerAddress } from '../../api/businessOwnerApi';
import { fetchManagerAddress, updateManagerAddress } from '../../api/managerApi';
import { fetchEmployeeAddress, updateEmployeeAddress } from '../../api/employeeApi';

interface AddressData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}



const Address = () => {
  const [form] = Form.useForm<AddressData>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [address, setAddress] = useState<AddressData>({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });
  
  const { themeColor } = useTheme();
  const { businessOwner, manager, employee } = useAuth();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (businessOwner.isAuthenticated) {
          const data = await fetchBusinessOwnerAddress();
          const mappedData: AddressData = {
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode
          };
          setAddress(mappedData);
          form.setFieldsValue(mappedData);
        } else if (manager.isAuthenticated) {
          const data = await fetchManagerAddress();
          const mappedData: AddressData = {
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode
          };
          setAddress(mappedData);
          form.setFieldsValue(mappedData);
        } else if (employee.isAuthenticated) {
          const data = await fetchEmployeeAddress();
          const mappedData: AddressData = {
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode
          };
          setAddress(mappedData);
          form.setFieldsValue(mappedData);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
    fetchAddress();
  }, [businessOwner.isAuthenticated, manager.isAuthenticated, employee.isAuthenticated, form]);

  const onFinish = async (values: AddressData) => {
    try {
      if (businessOwner.isAuthenticated) {
        await updateBusinessOwnerAddress(values);
      } else if (manager.isAuthenticated) {
        await updateManagerAddress(values );
      } else if (employee.isAuthenticated) {
        await updateEmployeeAddress(values);
      }
      setIsEditing(false);
      setAddress(values);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  return (
    <div className="mt-6">
      <Form<AddressData> 
        form={form} 
        onFinish={onFinish} 
        layout="vertical" 
        className="mt-4"
      >
        {(['street', 'city', 'state', 'country', 'postalCode'] as const).map(field => (
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