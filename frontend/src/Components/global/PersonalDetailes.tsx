import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Skeleton, Empty, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { fetchBusinessOwnerPersonalInfo, uploadBusinessOwnerProfileImage, updateBusinessOwnerPersonalInfo } from '../../api/businessOwnerApi';
import { fetchManagerPersonalInfo, updateManagerPersonalInfo, updateManagerProfilePicture } from '../../api/managerApi';
import { fetchEmployeePersonalInfo , uploadEmployeeProfileImage ,updateEmployeePersonalInfo } from "../../api/employeeApi";
import { setBusinessOwnerData } from '../../redux/slices/businessOwnerSlice';
import { setManagerData} from '../../redux/slices/managerSlice';
import { setEmployeeData } from '../../redux/slices/employeeSlice';
import { useDispatch } from 'react-redux';

interface ManagerInfo {
  managerName?: string;
  email: string;
  phone: string;
  profilePicture?: string;
  personalWebsite?: string;
}

interface BusinessOwnerInfo {
  businessOwnerName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  personalWebsite?: string;
}

interface EmployeeInfo {
  employeeName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  personalWebsite?: string;
}

export default function PersonalDetails() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [managerInfo, setManagerInfo] = useState<ManagerInfo | null>(null);
  const [businessOwnerInfo, setBusinessOwnerInfo] = useState<BusinessOwnerInfo | null>(null);
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [businessOwnerLoading, setBusinessOwnerLoading] = useState(false);
  const [managerLoading, setManagerLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const dispatch = useDispatch();

  const { themeColor } = useTheme();
  const { businessOwner, manager, employee } = useAuth();

  useEffect(() => {
    if (manager?.isAuthenticated) {
      setManagerLoading(true);
      fetchManagerPersonalInfo()
        .then((data: ManagerInfo) => {
          setManagerInfo(data);
          
          setProfileImage(data?.profilePicture ||"https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png");
        })
        .catch((error) => {
          console.error('Error fetching manager info:', error);
        })
        .finally(() => {
          setManagerLoading(false);
        });
    } else if (businessOwner?.isAuthenticated) {
      setBusinessOwnerLoading(true);
      fetchBusinessOwnerPersonalInfo()
        .then((data: BusinessOwnerInfo) => {
          setBusinessOwnerInfo(data);
          setProfileImage(data?.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png");
        })
        .catch((error) => {
          console.error('Error fetching business owner info:', error);
        })
        .finally(() => {
          setBusinessOwnerLoading(false);
        });
    } else if (employee?.isAuthenticated) {
      setEmployeeLoading(true);
      fetchEmployeePersonalInfo()
        .then((data: EmployeeInfo) => {
          setEmployeeInfo(data);
          setProfileImage(data?.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png");
        })
        .catch((error) => {
          console.error('Error fetching employee info:', error);
        })
        .finally(() => {
          setEmployeeLoading(false);
        });
    }
  }, [businessOwner, manager, employee]);

  console.log("profilepicter from PROFILe",profileImage);
  

  const handleProfilePictureChange = async (file: File) => {
    setImageLoading(true);
    try {
      if (manager?.isAuthenticated) {
        const response = await updateManagerProfilePicture(file);
         dispatch(setManagerData({
                managerName: manager.managerName,
                managerProfilePicture: response,
                companyLogo: manager.companyLogo,
                companyName: manager.companyName,
                managerType: manager.managerType,}));
        setProfileImage(response);
      } else if (businessOwner?.isAuthenticated) {
        const response = await uploadBusinessOwnerProfileImage(file);

        dispatch(
          setBusinessOwnerData({
            companyName: businessOwner.companyName, // Keep existing company name
            businessOwnerProfilePicture: response, // Update profile picture
            companyLogo: businessOwner.companyLogo, // Keep existing company logo
            
          })
        );  
        setProfileImage(response);
      } else if (employee?.isAuthenticated) {
        const response = await uploadEmployeeProfileImage(file); // Add a function for employee
        console.log("response--------------------------",response);
        
        dispatch(setEmployeeData({
          employeeName: employee.employeeName,
          employeeProfilePicture: response,
          companyLogo: employee.companyLogo,
          companyName: employee.companyName,
          employeeType: employee.employeeType
        }))
        setProfileImage(response);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (businessOwner?.isAuthenticated) {
        await updateBusinessOwnerPersonalInfo(values);
      } else if (manager?.isAuthenticated) {
        await updateManagerPersonalInfo(values);
      } else if (employee?.isAuthenticated) {
        await updateEmployeePersonalInfo(values); // Add function for employee update
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating personal details:', error.message);
    }
  };

  if (businessOwnerLoading || managerLoading || employeeLoading) {
    return <Skeleton active />;
  }

  const displayDetails: ManagerInfo | BusinessOwnerInfo | EmployeeInfo | null = businessOwner?.isAuthenticated
    ? businessOwnerInfo
    : manager?.isAuthenticated
    ? managerInfo
    : employee?.isAuthenticated
    ? employeeInfo
    : null;

  if (!displayDetails) {
    return <Empty description="No Personal Details Available" />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 pt-[60px] flex justify-center md:justify-start">
        <div className="space-y-6 w-[80%]">
          <div className="relative mb-2 flex flex-col items-center pt-4 h-[40%]">
            <img
              src={profileImage}
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
            businessOwnerName: 'businessOwnerName' in displayDetails ? displayDetails.businessOwnerName : '',
            managerName: 'managerName' in displayDetails ? displayDetails.managerName : '',
            employeeName: 'employeeName' in displayDetails ? displayDetails.employeeName : '', // Added employeeName
            email: displayDetails.email,
            personalWebsite: displayDetails.personalWebsite,
            phone: displayDetails.phone,
          }}
          className="mt-6"
        >
          {[
            ...(businessOwner?.isAuthenticated ? ['businessOwnerName'] : manager?.isAuthenticated ? ['managerName'] : employee?.isAuthenticated ? ['employeeName'] : []),
            'email',
            'phone',
            'personalWebsite',
          ].map((field) => (
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
