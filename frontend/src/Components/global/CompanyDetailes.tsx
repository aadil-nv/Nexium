import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Row, Col, message, Spin } from 'antd';
import { FiRefreshCcw } from "react-icons/fi";
import { UploadOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { fetchCompanyDetails } from '../../api/businessOwnerApi';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

// Define the structure of company details
interface CompanyDetailsType {
  companyName: string;
  companyLogo: string;
  companyRegistrationNumber: string;
  companyEmail: string;
  companyWebsite: string;

}

const CompanyDetails = () => {
  const [loading, setLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsType | null>(null); // Specify the type here
  const [logo, setLogo] = useState('https://avatar.iran.liara.run/public/boy?username=Ash');
  const [isEditing, setIsEditing] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const { themeColor } = useTheme();
  const { businessOwner } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCompanyDetails(businessOwner.isAuthenticated);

        setCompanyDetails(data);
        setLogo(data?.companyLogo);
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessOwner.isAuthenticated]);

  const handleLogoChange = async (file: File) => {
    if (!file) return message.error('No file selected.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLogoLoading(true);
      const response = await businessOwnerInstance.post('/businessOwner/api/business-owner/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setLogo(response.data.data);
        message.success('Logo updated successfully!');
      } else {
        message.error('Failed to update logo.');
      }
    } catch (error) {
      message.error('Error uploading logo.');
    } finally {
      setLogoLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (values: any) => {
    try {
      const response = await businessOwnerInstance.patch(
        '/businessOwner/api/business-owner/update-companydetailes',
        values
      );

      if (response.status === 200) {
        setCompanyDetails(values); // Update state with new company details
        message.success('Company details updated successfully!');
      } else {
        message.error('Failed to update company details.');
      }
    } catch (error) {
      message.error('Error updating company details.');
    }
  };

  if (loading) return <Spin size="large" />;
  if (!companyDetails) return <div>No data</div>;

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
                handleLogoChange(file);
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
          <Form layout="vertical" initialValues={companyDetails} onFinish={handleSubmit}>
            {fields.map((field) => (
              <Form.Item label={field.label} name={field.name} key={field.name}>
                <Input
                  defaultValue={isEditing ? companyDetails[field.name] : ""}
                  disabled={!isEditing}
                  placeholder={!isEditing ? companyDetails[field.name] : ""}
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
};

export default CompanyDetails;
