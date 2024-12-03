import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Skeleton, Empty, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { usePersonalDetails } from '../../api/businessOwnerApi';
import { uploadProfileImage, updateBusinessOwnerPersonalInfo } from '../../api/businessOwnerApi';
import { fetchManagerPersonalInfo , updateManagerPersonalInfo } from '../../api/managerApi';

export default function PersonalDetails() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [managerInfo, setManagerInfo] = useState(null);
  const { themeColor } = useTheme();
  const { businessOwner, manager } = useAuth();

  // Fetch business owner personal details
  const { loading: ownerLoading, personalDetails } = usePersonalDetails(businessOwner?.isAuthenticated);

  // Fetch manager personal details
  const [managerLoading, setManagerLoading] = useState(false);
  useEffect(() => {
    if (manager?.isAuthenticated) {
      setManagerLoading(true);
      fetchManagerPersonalInfo()
        .then((data) => {

         
          setManagerInfo(data);
          setProfileImage(data.profileImage || '');
        })
        
        .catch((error) => console.error('Error fetching manager personal info:', error))
        .finally(() => setManagerLoading(false));
    }
  }, [manager]);



  const handleProfilePictureChange = async (file: File) => {
    setImageLoading(true);
    try {
      const imageUrl = await uploadProfileImage(file);
      setProfileImage(imageUrl);
    } catch (error) {
      console.error('Error uploading profile image:', error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    const updatedDetails = { ...values };
    console.log('Form values:', updatedDetails);
    try {
      if(businessOwner?.isAuthenticated){
        await updateBusinessOwnerPersonalInfo(updatedDetails);
        
      }else if(manager?.isAuthenticated){
        await updateManagerPersonalInfo(updatedDetails);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating personal details:', error.message);
    }
  };

  if (ownerLoading || managerLoading) return <Skeleton active />;
  const displayDetails = businessOwner?.isAuthenticated ? personalDetails : managerInfo;

  if (!displayDetails) {
    return <Empty description="No Personal Details Available" />;
  }

  console.log("managerInfo",managerInfo)
  console.log("profuleImage",profileImage)

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 pt-[60px] flex justify-center md:justify-start">
        <div className="space-y-6 w-[80%]">
          <div className="relative mb-2 flex flex-col items-center pt-4 h-[40%]">
            <img
              src={profileImage || displayDetails.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                handleProfilePictureChange(file);
                return false;
              }}
            >
              <Button
                icon={<EditOutlined />}
                shape="circle"
                size="large"
                className="absolute bottom-0 right-0"
                style={{ borderColor: 'white', backgroundColor: 'white' }}
              />
            </Upload>
            {imageLoading && (
              <Spin
                spinning={imageLoading}
                size="small"
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 md:pt-0">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            businessOwnerName: displayDetails?.businessOwnerName || displayDetails?.managerName,
            email: displayDetails?.email || displayDetails.email,
            personalWebsite: displayDetails?.personalWebsite,
            phone: displayDetails?.phone,
          }}
          className="mt-6"
        >
          {['businessOwnerName', 'email', 'phone', 'personalWebsite'].map((field) => (
            <Form.Item
              key={field}
              name={field}
              label={field.replace(/([A-Z])/g, ' $1').toUpperCase()}
              rules={[{ required: true, message: `Please enter your ${field.toLowerCase()}` }]}
            >
              <Input
                prefix={
                  field === 'email' ? (
                    <MailOutlined />
                  ) : field === 'phone' ? (
                    <PhoneOutlined />
                  ) : (
                    <UserOutlined />
                  )
                }
                placeholder={`Enter your ${field.toLowerCase()}`}
                disabled={!isEditing}
                style={{ borderColor: themeColor }}
              />
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
        {!isEditing && (
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            className="mt-3"
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
          >
            Edit Details
          </Button>
        )}
      </div>
    </div>
  );
}
