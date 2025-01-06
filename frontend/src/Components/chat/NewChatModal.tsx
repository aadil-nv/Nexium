import React from 'react';
import { Modal, List, Badge, Avatar, Space } from 'antd';
import { Employee } from '../../interface/ChatInterface';

interface NewChatModalProps {
  isVisible: boolean;
  onClose: () => void;
  allEmployees: Employee[];
  handleUserSelect: (emp: Employee) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  isVisible,
  onClose,
  allEmployees,
  handleUserSelect,
}) => {
  return (
    <Modal
      title="Start New Chat"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <List
        className="max-h-[400px] overflow-auto"
        dataSource={allEmployees}
        renderItem={(emp) => (
          <List.Item
            onClick={() => handleUserSelect(emp)}
            className="cursor-pointer hover:bg-gray-50"
          >
            <List.Item.Meta
              avatar={
                <Badge dot status={emp.status ? 'success' : 'default'}>
                  <Avatar src={emp.receiverProfilePicture} size={32} />
                </Badge>
              }
              title={emp.receiverName}
              description={emp.receiverPosition || 'Employee'}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default NewChatModal;