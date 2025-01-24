import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker, Spin, Row, Col } from 'antd';
import { toast } from 'react-toastify';
import { managerSchema } from '../../config/validationSchema';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';
import { z } from 'zod';
import moment from 'moment';

const { Option } = Select;

const AddManagerModal: React.FC<{ isVisible: boolean; onClose: () => void, onManagerAdded: () => void }> = ({ isVisible, onClose, onManagerAdded }) => {
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
      setErrorMessage(''); 
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
    setErrorMessage(''); 

    try {
      const response = await businessOwnerInstance.post('/businessOwner/api/manager/add-managers', { ...formData });
      setLoading(false); // Set loading state to false after request
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
        onManagerAdded(); // Notify parent component that manager has been added
        onClose(); // Close modal after successful submission
      }
    } catch (error) {
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
        <Form layout="horizontal">
          <Row gutter={16}>
            {fields.map((field) => (
              <Col span={12} key={field.id}>
                <Form.Item label={field.label} validateStatus={errors[field.id] ? 'error' : ''} help={errors[field.id]}>
                  {field.type === 'select' ? (
                    <Select
                      value={formData[field.id]}
                      onChange={(value) => setFormData({ ...formData, [field.id]: value })}
                    >
                      {field.options?.map((option) => (
                        <Option key={option} value={option}>{option}</Option>
                      ))}
                    </Select>
                  ) : field.type === 'date' ? (
                    <DatePicker
  value={formData[field.id] ? moment(formData[field.id]) : null}
  onChange={(date) => setFormData({ ...formData, [field.id]: date?.toISOString().split('T')[0] })}
  format="YYYY-MM-DD"
/>
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.id]}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <div className="flex justify-end mt-4">
            <Button onClick={onClose} style={{ marginRight: '10px' }}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>Submit</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddManagerModal;
