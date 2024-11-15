import React, { useState } from 'react';
import { Button, ConfigProvider, Modal, Form, Input, Select, DatePicker, Space } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toast } from 'react-toastify'; // Assuming you have react-toastify set up for notifications
import {businessOwnerInstance} from "../../services/businessOwnerInstance"

const { Option } = Select;

const useStyle = createStyles(({ token }) => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-header': {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  'my-modal-footer': {
    color: token.colorPrimary,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const AddEmployeeModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const { styles } = useStyle();
  const token = useTheme();
  const themeColor = useSelector((state: RootState) => state.menu.themeColor);
  
  const [formData, setFormData] = useState({
    name: '',
    managerType: '',
    email: '',
    phoneNumber: '',
    joiningDate: '',
    salary: 0,
    workTime: '',
    companyLogo: '',
    profileImage: '',
  });

  const classNames = {
    body: styles['my-modal-body'],
    mask: styles['my-modal-mask'],
    header: styles['my-modal-header'],
    footer: styles['my-modal-footer'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    header: {
      borderLeft: `5px solid ${token.colorPrimary}`,
      borderRadius: 0,
      paddingInlineStart: 5,
    },
    mask: {
      backdropFilter: 'blur(10px)',
    },
    footer: {
      borderTop: '1px solid #333',
    },
    content: {
      boxShadow: '0 0 30px #999',
    },
  };

  const fields = [
    { id: 'name', label: 'Manager Name', type: 'text' },
    { id: 'managerType', label: 'Manager Type', type: 'select', options: ["HumanResourceManager", "GeneralManager", "ProjectManager", "SalesManager"] },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { id: 'joiningDate', label: 'Date of join', type: 'date' },
    { id: 'salary', label: 'Salary', type: 'number' },
    { id: 'workTime', label: 'Work Time', type: 'select', options: ["Full-Time", "Part-Time", "Contract", "Temporary"] },
  ];

  const handleSubmit = async (e: React.FormEvent) => {

    const dataToSend = {
      ...formData,
      phone: formData.phoneNumber,
      documents: [],
      companyCredentials: {
        companyName: '',
        companyRegistrationNumber: '',
        email: '',
        password: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    };

    try {
      const response = await businessOwnerInstance.post('/businessOwner/api/manager/add-managers', dataToSend);
      if (response.status === 200) {
        toast.success('Form submitted successfully!');
        setFormData({
          name: '',
          managerType: '',
          email: '',
          phoneNumber: '',
          joiningDate: '',
          companyLogo: '',
          profileImage: '',
          salary: 0,
          workTime: '',
        });
      } else {
        toast.error('Failed to submit the form!');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the form!');
      console.error('Error:', error);
    }
  };

  return (
    <Modal
      title="Add Employee"
      open={isVisible}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      classNames={classNames}
      styles={modalStyles}
    >
      {/* Employee Form inside the Modal */}
      <Form layout="horizontal" onFinish={handleSubmit}>
        {fields.map((field) => (
          <Form.Item
            key={field.id}
            label={field.label}
            name={field.id}
            rules={[{ required: true, message: `Please input ${field.label.toLowerCase()}!` }]}
          >
            {field.type === 'select' ? (
              <Select placeholder={`Select ${field.label}`} onChange={(value) => setFormData({ ...formData, [field.id]: value })}>
                {field.options?.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            ) : field.type === 'date' ? (
              <DatePicker style={{ width: '100%' }} onChange={(date) => setFormData({ ...formData, [field.id]: date })} />
            ) : field.type === 'number' ? (
              <Input type="number" placeholder={`Enter ${field.label}`} onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })} />
            ) : (
              <Input placeholder={`Enter ${field.label}`} onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })} />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;
