import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker, Spin, Row, Col } from 'antd';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { managerSchema } from '../../config/validationSchema';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';

const { Option } = Select;

const AddManagerModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    managerType: 'GeneralManager',
    email: '',
    phoneNumber: '',
    joiningDate: '',
    salary: 0,
    workTime: 'Full-Time',
    companyLogo: '',
    profileImage: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message for top display

  const fields = [
    { id: 'name', label: 'Manager Name', type: 'text' },
    { id: 'managerType', label: 'Manager Type', type: 'select', options: ['HumanResourceManager', 'GeneralManager', 'ProjectManager', 'SalesManager'] },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { id: 'joiningDate', label: 'Date of Join', type: 'date' },
    { id: 'salary', label: 'Salary', type: 'number' },
    { id: 'workTime', label: 'Work Time', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract', 'Temporary'] },
  ];

  const validateForm = () => {
    try {
      managerSchema.parse(formData);
      setErrors({});
      setErrorMessage(''); // Clear any previous error message
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true); // Set loading state to true
    setErrorMessage(''); // Clear any previous error messages

    try {
      const response = await businessOwnerInstance.post('/businessOwner/api/manager/add-managers', { ...formData });
      setLoading(false); // Set loading state to false after request
        console.log("response------------",response);
        
      if (response.status === 200) {
        toast.success(response.data.message);
        setFormData({
          name: '',
          managerType: 'GeneralManager',
          email: '',
          phoneNumber: '',
          joiningDate: '',
          salary: 0,
          workTime: 'Full-Time',
          companyLogo: '',
          profileImage: '',
        });
        setErrors({});
        onClose(); // Close modal after successful submission
      }
    } catch (error) {
      console.log("errrrrr",error);
      
      setLoading(false); // Set loading state to false in case of error
      setErrorMessage(error.response.data.error);
      toast.error('An error occurred while submitting the form!');
      console.error('Error:', error);
    }
  };

  return (
    <Modal
      title="Add Employee"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={600} // Ensures modal width remains unchanged
    >
      <Spin spinning={loading}> {/* Show spinner while loading */}
        <Form layout="horizontal" onFinish={handleSubmit}>
          {errorMessage && (
            <Row>
              <Col span={24}>
                <div style={{ color: 'rose', padding: '10px', border: '1px solid #f44336', borderRadius: '4px' }}>
                  {errorMessage} {/* Display error message at the top */}
                </div>
              </Col>
            </Row>
          )}

          {fields.map((field) => (
            <Form.Item
              key={field.id}
              label={field.label}
              name={field.id}
              help={errors[field.id]} // Show error message below input
              validateStatus={errors[field.id] ? 'error' : ''} // Highlight field in red if there's an error
            >
              {field.type === 'select' ? (
                <Select
                  onChange={(value) => setFormData({ ...formData, [field.id]: value })}
                  value={formData[field.id]}
                >
                  {field.options?.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              ) : field.type === 'date' ? (
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={(date, dateString) => setFormData({ ...formData, [field.id]: dateString })}
                  value={formData[field.id] ? formData[field.id] : null}
                />
              ) : field.type === 'number' ? (
                <Input
                  type="number"
                  placeholder={`Enter ${field.label}`}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  value={formData[field.id]}
                />
              ) : (
                <Input
                  placeholder={`Enter ${field.label}`}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  value={formData[field.id]}
                />
              )}
            </Form.Item>
          ))}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}> {/* Add loading to button */}
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddManagerModal;
