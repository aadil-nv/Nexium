import React from 'react';
import { Modal, Space, Input, List, Checkbox, Avatar, message } from 'antd';
import { Employee } from '../../interface/ChatInterface';
import { communicationInstance } from '../../services/communicationInstance';

interface CreateGroupModalProps {
  isVisible: boolean;
  onClose: () => void;
  employees: Employee[];
  themeColor: string;
  refreshGroups: () => Promise<void>;
  setActiveTab: (tab: string) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isVisible,
  onClose,
  employees,
  themeColor,
  refreshGroups,
  setActiveTab
}) => {
  const [groupName, setGroupName] = React.useState('');
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setGroupName('');
    setSelectedMembers([]);
    onClose();
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim()) {
      return message.error('Please enter a group name');
    }
    if (selectedMembers.length < 2) {
      return message.error('Please select at least 2 members');
    }

    setLoading(true);
    try {
      await communicationInstance.post('/communication-service/api/chat/create-group', {
        groupName: groupName,
        members: selectedMembers
      });
      
      await refreshGroups();
      message.success('Group created successfully');
      handleClose();
      setActiveTab('2');
    } catch (error) {
      console.error('Error creating group:', error);
      message.error('Failed to create group. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Create New Group"
      open={isVisible}
      onCancel={handleClose}
      onOk={createGroup}
      confirmLoading={loading}
      okText="Create Group"
      okButtonProps={{ style: { backgroundColor: themeColor } }}
    >
      <Space direction="vertical" className="w-full">
        <Input
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mb-4"
        />
        
        <List
          className="max-h-[300px] overflow-auto"
          dataSource={employees}
          renderItem={(emp) => (
            <List.Item>
              <Checkbox
                checked={selectedMembers.includes(emp.receiverId)}
                onChange={() => toggleMember(emp.receiverId)}
                className="w-full"
              >
                <Space>
                  <Avatar src={emp.receiverProfilePicture} size={32} />
                  <Space direction="vertical" size={0}>
                    <span>{emp.receiverName}</span>
                    <span className="text-xs text-gray-500">{emp.receiverPosition || 'Employee'}</span>
                  </Space>
                </Space>
              </Checkbox>
            </List.Item>
          )}
        />
      </Space>
    </Modal>
  );
};

export default CreateGroupModal;