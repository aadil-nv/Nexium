import  { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Skeleton, Empty, Spin, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, BankOutlined, IdcardOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { fetchBusinessOwnerPersonalInfo, uploadBusinessOwnerProfileImage, updateBusinessOwnerPersonalInfo } from '../../api/businessOwnerApi';
import { fetchManagerPersonalInfo, updateManagerPersonalInfo, updateManagerProfilePicture } from '../../api/managerApi';
import { fetchEmployeePersonalInfo, uploadEmployeeProfileImage, updateEmployeePersonalInfo } from "../../api/employeeApi";
import { setBusinessOwnerData } from '../../redux/slices/businessOwnerSlice';
import { setManagerData } from '../../redux/slices/managerSlice';
import { setEmployeeData } from '../../redux/slices/employeeSlice';
import { useDispatch } from 'react-redux';

const DEFAULT_PROFILE_IMAGE = "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png";

interface CommonInfo {
  email: string;
  phone: string;
  profilePicture?: string;
  personalWebsite?: string;
}

interface ManagerInfo extends CommonInfo {
  managerName?: string;
}

interface BusinessOwnerInfo extends CommonInfo {
  businessOwnerName: string;
}

interface EmployeeInfo extends CommonInfo {
  employeeName: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  aadharNumber: string;
  panNumber: string;
  gender: string;
  profilePicture?: string;
}

export default function PersonalDetails() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<ManagerInfo | BusinessOwnerInfo | EmployeeInfo | null>(null);
  
  const dispatch = useDispatch();
  const { themeColor } = useTheme();
  const { businessOwner, manager, employee } = useAuth();

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      let data: ManagerInfo | BusinessOwnerInfo | EmployeeInfo | null = null;
      if (manager?.isAuthenticated) {
        data = await fetchManagerPersonalInfo();
      } else if (businessOwner?.isAuthenticated) {
        data = await fetchBusinessOwnerPersonalInfo();
      } else if (employee?.isAuthenticated) {
        data = await fetchEmployeePersonalInfo();
      }
      setUserInfo(data);
      setProfileImage(data?.profilePicture || DEFAULT_PROFILE_IMAGE);
      form.setFieldsValue(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessOwner, manager, employee]);

  const handleProfilePictureChange = async (file: File) => {
    setImageLoading(true);
    try {
      let response;
      if (manager?.isAuthenticated) {
        response = await updateManagerProfilePicture(file);
        dispatch(setManagerData({
          managerName: manager.managerName,
          managerProfilePicture: response,
          companyLogo: manager.companyLogo,
          companyName: manager.companyName,
          managerType: manager.managerType,
        }));
      } else if (businessOwner?.isAuthenticated) {
        response = await uploadBusinessOwnerProfileImage(file);
        dispatch(setBusinessOwnerData({
          companyName: businessOwner.companyName,
          businessOwnerProfilePicture: response,
          companyLogo: businessOwner.companyLogo,
        }));
      } else if (employee?.isAuthenticated) {
        response = await uploadEmployeeProfileImage(file);
        dispatch(setEmployeeData({
          employeeName: employee.employeeName,
          employeeProfilePicture: response,
          companyLogo: employee.companyLogo,
          companyName: employee.companyName,
          employeeType: employee.employeeType
        }));
      }
      setProfileImage(response);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const onFinish = async (values : ManagerInfo | BusinessOwnerInfo | EmployeeInfo) => {
    try {
      const updateFunctions = {
        manager: updateManagerPersonalInfo,
        businessOwner: updateBusinessOwnerPersonalInfo,
        employee: updateEmployeePersonalInfo
      };
      
      const userType = manager?.isAuthenticated ? 'manager' : 
                      businessOwner?.isAuthenticated ? 'businessOwner' : 'employee';
                      
      await updateFunctions[userType](values);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating details:', error);
    }
  };

  if (loading) return <Skeleton active />;
  if (!userInfo) return <Empty description="No Personal Details Available" />;

  const employeeFields = employee?.isAuthenticated && [
    { name: 'bankAccountNumber', label: 'BANK ACCOUNT NUMBER', icon: <BankOutlined /> },
    { name: 'ifscCode', label: 'IFSC CODE', icon: <BankOutlined /> },
    { name: 'aadharNumber', label: 'AADHAR NUMBER', icon: <IdcardOutlined /> },
    { name: 'panNumber', label: 'PAN NUMBER', icon: <IdcardOutlined /> }
  ];

  const commonFields = [
    { name: employee?.isAuthenticated ? 'employeeName' : 
           manager?.isAuthenticated ? 'managerName' : 'businessOwnerName',
      label: 'NAME', icon: <UserOutlined /> },
    { name: 'email', label: 'EMAIL', icon: <MailOutlined /> },
    { name: 'phone', label: 'PHONE', icon: <PhoneOutlined /> },
    { name: 'personalWebsite', label: 'PERSONAL WEBSITE', icon: <UserOutlined /> }
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 pt-[60px] flex justify-center md:justify-start">
        <div className="relative mb-2 flex flex-col items-center pt-4 h-[40%]">
          <div className="relative">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-40 h-40 rounded-full object-cover mx-auto" // Increased from w-24 h-24
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
                className="absolute bottom-2 right-2" // Adjusted positioning
                style={{ 
                  borderColor: 'white', 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)' // Added shadow for better visibility
                }} 
              />
            </Upload>
            {imageLoading && (
              <Spin 
                size="small" 
                className="absolute bottom-2 right-2" // Matched with button position
              />
            )}
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="flex-1 md:pt-0">
        <Form 
          form={form} 
          onFinish={onFinish} 
          layout="vertical" 
          className="mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonFields.map(({ name, label, icon }) => (
              <Form.Item
                key={name}
                name={name}
                label={label}
                rules={[{ required: true, message: `Please enter your ${name}` }]}
              >
                <Input
                  prefix={icon}
                  placeholder={`Enter your ${name.toLowerCase()}`}
                  disabled={!isEditing}
                  style={{ borderColor: themeColor }}
                />
              </Form.Item>
            ))}

            {employeeFields && employeeFields.map(({ name, label, icon }) => (
              <Form.Item
                key={name}
                name={name}
                label={label}
                rules={[{ required: true, message: `Please enter your ${name}` }]}
              >
                <Input
                  prefix={icon}
                  placeholder={`Enter your ${name.toLowerCase()}`}
                  disabled={!isEditing}
                  style={{ borderColor: themeColor }}
                />
              </Form.Item>
            ))}

            {employee?.isAuthenticated && (
              <>

                <Form.Item 
                  name="gender" 
                  label="GENDER" 
                  rules={[{ required: true }]}
                >
                  <Select
                    disabled={!isEditing}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                </Form.Item>
              </>
            )}
          </div>

          <div className="mt-6">
            {isEditing ? (
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
            ) : (
              <Button 
                icon={<EditOutlined />} 
                onClick={() => setIsEditing(true)} 
                style={{ backgroundColor: themeColor, borderColor: themeColor }}
                className="w-full md:w-auto"
              >
                Edit Details
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}