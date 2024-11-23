import React, { useState, useEffect } from 'react'; 
import { Form, Input, Skeleton, Button, Upload, Row, Col } from 'antd';
import { FiRefreshCcw } from "react-icons/fi";
import { UploadOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme'; // Assuming this hook provides themeColor
import useAuth from '../../hooks/useAuth';
import { fetchCompanyDetails } from '../../api/businessOwnerApi'; // Import the API function

export default function CompanyDetails() {
  const [loading, setLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [logo, setLogo] = useState<string>('https://avatar.iran.liara.run/public/boy?username=Ash');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { themeColor } = useTheme();
  const { businessOwner, employee, manager, superAdmin } = useAuth();
  const isBusinessOwner = businessOwner.isAuthenticated;
  const isManager = manager.isAuthenticated;
  const isEmployee = employee.isAuthenticated;
  const isSuperAdmin = superAdmin.isAuthenticated;
  const isActiveUser = isBusinessOwner || isManager || isEmployee || isSuperAdmin;

  // Fetch company details from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCompanyDetails(isBusinessOwner);
        
        if (data) {
          setCompanyDetails(data);
          setLogo(data.companyLogoUrl);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isBusinessOwner]); // Only re-fetch if isBusinessOwner changes

  const handleUpdate = (values: any) => {
    console.log("Updated Data:", values);
    setIsEditing(false);
  };

  const handleLogoChange = (info: any) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <Skeleton active />;
  }

  if (!companyDetails) {
    return <div>No data</div>;
  }

  const fields = [
    { label: 'Company Name', name: 'companyName' },
    { label: 'Registration Number', name: 'companyRegistrationNumber' },
    { label: 'Company Email', name: 'companyEmail' },
    { label: 'Company Website', name: 'companyWebsite' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16} align="middle">
        {/* Logo Section */}
        <Col xs={24} sm={6} md={6} lg={6}>
          <div style={{ textAlign: 'center' }}>
            <img
              src={logo}
              alt="Company Logo"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '10px',
              }}
            />
            <Upload
              customRequest={() => {}}
              showUploadList={false}
              onChange={handleLogoChange}
              accept="image/*"
            >
              <Button
                type="default"
                icon={<UploadOutlined />}
                style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-block' }}
              >
                Edit Logo
              </Button>
            </Upload>
          </div>
        </Col>

        {/* Form to Update Company Details */}
        <Col xs={24} sm={18} md={18} lg={18}>
          <Form layout="vertical" initialValues={companyDetails} onFinish={handleUpdate}>
            {fields.map((field) => (
              <Form.Item label={field.label} name={field.name} key={field.name}>
                <Input
                  defaultValue={isEditing ? companyDetails[field.name] : ""}
                  disabled={!isEditing}
                  placeholder={!isEditing ? (companyDetails[field.name] || `Enter ${field.label}`) : ""}
                  className="text-black"
                />
              </Form.Item>
            ))}

            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: themeColor, borderColor: themeColor }}
              icon={<FiRefreshCcw />}
            >
              {isEditing ? 'Save Changes' : 'Edit Details'}
            </Button>

            <Button
              type="default"
              onClick={() => setIsEditing(!isEditing)}
              style={{ marginLeft: '10px' }}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
