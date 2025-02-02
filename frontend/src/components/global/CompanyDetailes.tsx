import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Row, Col, message, Spin } from 'antd';
import { FiSave, FiEdit } from "react-icons/fi";
import { UploadOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { fetchCompanyDetails } from '../../api/businessOwnerApi';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';
import { useDispatch } from 'react-redux';
import { setBusinessOwnerData } from "../../redux/slices/businessOwnerSlice";

interface CompanyDetailsType {
  companyName: string;
  companyLogo: string;
  companyRegistrationNumber: string;
  companyEmail: string;
  companyWebsite: string;
}

const CompanyDetails = () => {
  const [loading, setLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsType | null>(null);
  const [logo, setLogo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Track if we're in the update process
  const [logoLoading, setLogoLoading] = useState(false);
  const { themeColor } = useTheme();
  const { businessOwner } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCompanyDetails(businessOwner.isAuthenticated);
        setCompanyDetails(data);
        console.log("data is ------->",data);

        setLogo(data?.companyLogo ||"https://cdn.pixabay.com/photo/2012/04/23/15/57/copyright-38672_640.png");
      } catch {
        message.error('Failed to fetch company details');
      } finally {
        setLoading(false);
      }
    })();
  }, [businessOwner.isAuthenticated]);

  const handleLogoChange = async (file: File) => {
    if (!file) return message.error('No file selected.');
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLogoLoading(true);
      const { data } = await businessOwnerInstance.post('/businessOwner-service/api/business-owner/upload-logo', formData);
      setLogo(data.data);
      dispatch(setBusinessOwnerData({...businessOwner, companyLogo: data.data }));
      message.success('Logo updated successfully!');
    } catch {
      message.error('Failed to update logo');
    } finally {
      setLogoLoading(false);
    }
  };

  const handleSubmit = async (values: CompanyDetailsType) => {
    try {
       await businessOwnerInstance.patch('/businessOwner-service/api/business-owner/update-companydetailes', values);
      // Re-fetch the company details after updating
      const updatedData = await fetchCompanyDetails(businessOwner.isAuthenticated);
      setCompanyDetails(updatedData); // Update state with the new details
      dispatch(
        setBusinessOwnerData({
          companyName: updatedData?.companyName, // Keep existing company name
          businessOwnerProfilePicture: businessOwner.businessOwnerProfilePicture, // Update profile picture
          companyLogo: businessOwner.companyLogo, // Keep existing company logo
        })
      );  
      setIsEditing(false);
      setIsUpdating(false); // Reset the update process state
      message.success('Company details updated successfully!');
    } catch {
      message.error('Failed to update company details');
    }
  };

  if (loading) return <Spin size="large" />;
  if (!companyDetails) return <div>No data</div>;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setIsUpdating(true); // Start the update process when editing is toggled
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Row gutter={[16, 16]} justify="center" align="top">
        <Col xs={24} sm={8} md={6}>
          <div style={{ textAlign: 'center' }}>
            <Spin spinning={logoLoading} size="small">
              <img
                src={logo }
                alt="Company Logo"
                style={{
                  width: '100%',
                  maxWidth: '150px',
                  objectFit: 'contain',
                  marginBottom: '10px',
                }}
              />
            </Spin>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                handleLogoChange(file);
                return false;
              }}
            >
              <Button
                icon={<UploadOutlined />}
                style={{ marginTop: '10px' }}
                disabled={!isEditing}
              >
                Update Logo
              </Button>
            </Upload>
          </div>
        </Col>
        <Col xs={24} sm={16} md={18}>
          <Form
            layout="vertical"
            initialValues={companyDetails}
            onFinish={handleSubmit}
            style={{ padding: '0 10px' }}
          >
            {['companyName', 'companyRegistrationNumber', 'companyEmail', 'companyWebsite'].map((field) => (
              <Form.Item
                label={field.replace(/([A-Z])/g, ' $1')}
                name={field}
                key={field}
              >
                <Input disabled={!isEditing} />
              </Form.Item>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: themeColor }}
                icon={isEditing ? <FiSave /> : <FiEdit />}
                disabled={!isUpdating}
              >
                {isEditing ? 'Save Changes' : 'Edit Details'}
              </Button>
              <Button onClick={handleEditToggle}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyDetails;
