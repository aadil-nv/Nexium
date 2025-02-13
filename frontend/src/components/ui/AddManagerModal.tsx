import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker, Spin, Row, Col } from 'antd';
import { toast } from 'react-toastify';
import { businessOwnerInstance } from '../../services/businessOwnerInstance';
import moment from 'moment';
import { AxiosError } from 'axios';

const { Option } = Select;

interface FormDataType {
  name: string;
  managerType: string;
  email: string;
  phoneNumber: string;
  joiningDate: string;
  salary: number;
  workTime: string;
  companyLogo: string;
  profileImage: string;
}

interface FieldType {
  id: keyof FormDataType;
  label: string;
  type: 'text' | 'email' | 'select' | 'date' | 'number';
  options?: string[];
}

interface AddManagerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onManagerAdded: () => void;
}

const AddManagerModal: React.FC<AddManagerModalProps> = ({ isVisible, onClose, onManagerAdded }) => {
  const [formData, setFormData] = useState<FormDataType>({
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

  const [errors, setErrors] = useState<{ [K in keyof FormDataType]?: string }>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fields: FieldType[] = [
    { id: 'name', label: 'Manager Name', type: 'text' },
    { id: 'managerType', label: 'Manager Type', type: 'select', options: ['HumanResourceManager', 'GeneralManager', 'ProjectManager', 'SalesManager'] },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { id: 'joiningDate', label: 'Date of Join', type: 'date' },
    { id: 'salary', label: 'Salary', type: 'number' },
    { id: 'workTime', label: 'Work Time', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract', 'Temporary'] },
  ];

  const validateForm = () => {
    const newErrors: { [K in keyof FormDataType]?: string } = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    // Joining date validation
    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
      isValid = false;
    }

    // Salary validation
    if (formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
      isValid = false;
    }

    // Manager type validation
    if (!formData.managerType) {
      newErrors.managerType = 'Manager type is required';
      isValid = false;
    }

    // Work time validation
    if (!formData.workTime) {
      newErrors.workTime = 'Work time is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await businessOwnerInstance.post(
        '/businessOwner-service/api/manager/add-managers',
        { ...formData }
      );
      setLoading(false);

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
        onManagerAdded();
        onClose();
      }
    } catch (error) {
      setLoading(false);

      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.error || 'An error occurred.');
        console.error('Axios Error:', error.response?.data?.error);
      } else {
        // setErrorMessage('An unexpected error occurred.');
        console.error('Unexpected Error:', error);
      }
    }
  };

  const handleInputChange = (id: keyof FormDataType, value: string | number) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  return (
    <Modal
      title="Add Employee"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Spin spinning={loading}>
        <Form layout="horizontal">
          <Row gutter={16}>
            {fields.map((field) => (
              <Col span={12} key={field.id}>
                <Form.Item label={field.label} validateStatus={errors[field.id] ? 'error' : ''} help={errors[field.id]}>
                  {field.type === 'select' ? (
                    <Select
                      value={formData[field.id]}
                      onChange={(value) => handleInputChange(field.id, value)}
                    >
                      {field.options?.map((option) => (
                        <Option key={option} value={option}>{option}</Option>
                      ))}
                    </Select>
                  ) : field.type === 'date' ? (
                    <DatePicker
                      value={formData[field.id] ? moment(formData[field.id]) : null}
                      onChange={(date) => handleInputChange(field.id, date?.toISOString().split('T')[0] || '')}
                      format="YYYY-MM-DD"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.id]}
                      onChange={(e) => handleInputChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
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