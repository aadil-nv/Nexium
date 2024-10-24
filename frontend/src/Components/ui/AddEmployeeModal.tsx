import React, { useState } from 'react';
import { Button, ConfigProvider, Modal, Form, Input, Space } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { useSelector } from 'react-redux';

const useStyle = createStyles(({ token }) => ({
  'my-modal-body': {
    background: token.blue1,
    padding: token.paddingSM,
  },
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
  const themeColor = useSelector((state: { menu: { themeColor: RootState} }) => state.menu.themeColor);


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
    body: {
      boxShadow: 'inset 0 0 5px #999',
      borderRadius: 5,
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

  return (
    <Modal
      title="Add Employee"
      open={isVisible}
      onOk={onClose}
      onCancel={onClose}
      footer={null}  // You can add custom buttons here if needed
      classNames={classNames}
      styles={modalStyles}
    >
      {/* Employee Form inside the Modal */}
      <Form layout="vertical">
        <Form.Item label="Employee Name" name="name" rules={[{ required: true, message: 'Please input employee name!' }]}>
          <Input placeholder="Enter employee name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
          <Input placeholder="Enter employee email" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone">
          <Input placeholder="Enter phone number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;
