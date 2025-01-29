import React from 'react';
import { Modal, List, Space, Badge, Avatar } from 'antd';
import { CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Employee } from '../../interface/ChatInterface';
import { communicationInstance } from '../../services/communicationInstance';

interface TargetUser {
  chatId: string;
  senderId: string;
  id: string;
  name: string;
  avatar: string | undefined;
  type: 'private';
  status: boolean;
}
interface StartChatModalProps {
  isVisible: boolean;
  onClose: () => void;
  employees: Employee[];
  formatLastSeen: (date: Date) => string;
  setSelectedTarget: (target : TargetUser) => void;
}

const StartChatModal: React.FC<StartChatModalProps> = ({
  isVisible,
  onClose,
  employees,
  formatLastSeen,
  setSelectedTarget
}) => {
  const handleUserSelect = async (emp: Employee) => {
    try {
      const response = await communicationInstance.post(`/communication-service/api/chat/create-chat/${emp.receiverId}`);
      const chatId = response.data.chatId;

      setSelectedTarget({
        chatId: chatId,
        senderId: emp.senderId,
        id: emp.receiverId,
        name: emp.receiverName,
        avatar: emp.receiverProfilePicture,
        type: 'private',
        status: emp.status
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <Modal
      title="Start New Chat"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <List
        className="max-h-[400px] overflow-auto"
        dataSource={employees}
        renderItem={(emp) => (
          <List.Item
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleUserSelect(emp)}
          >
            <List.Item.Meta
              avatar={
                <Badge dot status={emp.status ? 'success' : 'default'} offset={[-4, 32]}>
                  <Avatar src={emp.receiverProfilePicture} size={40} />
                </Badge>
              }
              title={
                <Space direction="vertical" size={0}>
                  <span className="font-medium">{emp.receiverName}</span>
                  <span className="text-xs text-gray-500">{emp.receiverPosition || 'Employee'}</span>
                </Space>
              }
              description={
                emp.status ? (
                  <Space><CheckOutlined className="text-green-500" /> Active now</Space>
                ) : (
                  <Space><ClockCircleOutlined className="text-gray-400" /> Last seen {formatLastSeen(emp.lastSeen)}</Space>
                )
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default StartChatModal;