import React, { useState } from 'react';
import { Button, ConfigProvider, Modal, Form, Input, Select, DatePicker, Space } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

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

  const handleSubmit = (values: any) => {
    // Handle form submission here
    console.log(values);
    onClose();
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
              <Select placeholder={`Select ${field.label}`}>
                {field.options?.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            ) : field.type === 'date' ? (
              <DatePicker style={{ width: '100%' }} />
            ) : field.type === 'number' ? (
              <Input type="number" placeholder={`Enter ${field.label}`} />
            ) : (
              <Input placeholder={`Enter ${field.label}`} />
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
