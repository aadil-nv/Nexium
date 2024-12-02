import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Row, Col, message, Spin } from 'antd';
import { FiRefreshCcw } from "react-icons/fi";
import { UploadOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme'; 
import useAuth from '../../hooks/useAuth';
import { fetchCompanyDetails } from '../../api/businessOwnerApi'; 
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

export default function CompanyDetails() {
  const [loading, setLoading] = useState<boolean>(true); // State for loading, with correct type
  const [companyDetails, setCompanyDetails] = useState<any>(null); // State for company details
  const [logo, setLogo] = useState<string>('https://avatar.iran.liara.run/public/boy?username=Ash');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [logoLoading, setLogoLoading] = useState<boolean>(false); // State for logo loading
  const { themeColor } = useTheme();
  const { businessOwner } = useAuth();
  const isBusinessOwner = businessOwner.isAuthenticated;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCompanyDetails(isBusinessOwner);

        console.log("Company Details:", data);
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
  }, [isBusinessOwner]);

  const handleUpdate = (values: any) => {
    console.log("Updated Data:", values);
    setIsEditing(false);
  };

  const handleLogoChange = async (file: File) => {
    if (!file) {
      message.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLogoLoading(true); // Set logo loading state to true
      const response = await businessOwnerInstance.post('/businessOwner/api/business-owner/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        console.log('Logo uploaded successfully:', response.data.data);
        setLogo(response.data.data); // Update logo URL
        message.success('Logo updated successfully!');
      } else {
        message.error('Failed to update logo.');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      message.error('Error uploading logo.');
    } finally {
      setLogoLoading(false); // Set logo loading state to false
    }
  };

  if (loading) {
    return <Spin size="large" />;
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
            <Spin spinning={logoLoading} size="small">
              <img
                src={logo}
                alt="Company Logo"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '70%',
                  objectFit: 'fill',
                  marginBottom: '10px',
                }}
              />
            </Spin>
            <Upload
              accept="image/*"
              listType="picture"
              showUploadList={false}
              beforeUpload={(file) => {
                handleLogoChange(file);  // Correct file handling
                return false;
              }}
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
