import React, { useState } from 'react';
import { List, Badge, Avatar, Button, Space, Typography, message, Modal, Input, Checkbox, Tabs } from 'antd';
import { Employee, Group } from '../../interface/ChatInterface';
import { UsergroupAddOutlined, ClockCircleOutlined, CheckOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import { chatInstance } from '../../services/chatInstance';
import { motion } from 'framer-motion';

const { Title } = Typography;
const { TabPane } = Tabs;

interface ChatTarget {
  chatId?: string;
  senderId: string;
  id: string;
  name: string;
  avatar?: string;
  type: 'private' | 'group';
  status?: boolean;
}

interface ChatPeoplesProps {
  employees: Employee[];
  groups: Group[];
  setSelectedTarget: (target: ChatTarget) => void;
  isMobile: boolean;
  formatLastSeen: (date: Date) => string;
  setSiderVisible: (visible: boolean) => void;
  refreshGroups: () => Promise<void>;
}

const ChatPeoples: React.FC<ChatPeoplesProps> = ({
  employees,
  groups,
  setSelectedTarget,
  isMobile,
  formatLastSeen,
  setSiderVisible,
  refreshGroups
}) => {
  const { themeColor } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [chatId, setChatId] = useState<string>('');

  const handleUserSelect   = async (emp: Employee) => {
    try {
      setSelectedTarget({
        chatId: chatId,
        senderId: emp.senderId,
        id: emp.receiverId,
        name: emp.receiverName,
        avatar: emp.receiverProfilePicture,
        type: 'private',
        status: emp.status
      });
      isMobile && setSiderVisible(false);
     const response = await chatInstance.post(`/chatService/api/chat/create-chat/${emp.receiverId}`)
     .then(response => setChatId(response.data.chatId))
     .catch(error => console.error('Error creating chat:', error));

    } catch (error) {
      console.error('Error creating chat:', error);
      // message.error('Failed to create chat. Please try again.');
    }
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedTarget({
      chatId: group.groupId,
      senderId: group.senderId,
      id: group.groupId,
      name: group.groupName,
      avatar: group.avatar,
      type: 'group'
    });
    isMobile && setSiderVisible(false);
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
      const response = await chatInstance.post('/chatService/api/chat/create-group', {
        groupName: groupName,
        members: selectedMembers
      });
      
      // Refresh the groups list
      await refreshGroups();
      
      message.success('Group created successfully');
      setIsModalVisible(false);
      setGroupName('');
      setSelectedMembers([]);
      
      // Switch to groups tab
      setActiveTab('2');
    } catch (error) {
      console.error('Error creating group:', error);
      message.error('Failed to create group. Please try again.');
    }
    setLoading(false);
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="relative h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-white"
        style={{ height: 'calc(100vh - 180px)', overflowY: 'hidden' }}
      >
        <Title level={3} className="mb-4">Chats</Title>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="custom-tabs"
        >
          <TabPane 
            tab={<span><UserOutlined /> People</span>}
            key="1"
          >
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 280px)' }}>
              <List
                dataSource={employees}
                renderItem={(emp) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <List.Item
                      onClick={() => handleUserSelect(emp)}
                      className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg mb-2 transition-all"
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
                  </motion.div>
                )}
              />
            </div>
          </TabPane>

          <TabPane 
            tab={<span><TeamOutlined /> Groups</span>}
            key="2"
          >
            <div className="flex flex-col h-full">
              <div className="overflow-y-auto flex-grow" style={{ height: 'calc(100vh - 340px)' }}>
                <List
                  dataSource={groups}
                  renderItem={(group) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <List.Item
                        onClick={() => handleGroupSelect(group)}
                        className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg mb-2 transition-all"
                      >
                        <List.Item.Meta
                          avatar={
                            group.avatar ? (
                              <Avatar src={group.avatar} size={40} />
                            ) : (
                              <Avatar style={{ backgroundColor: themeColor }} size={40}>
                                {group.groupName.charAt(0)}
                              </Avatar>
                            )
                          }
                          title={
                            <Space direction="vertical" size={0}>
                              <span className="font-medium">{group.groupName}</span>
                              <span className="text-xs text-gray-500">{group.members} members</span>
                            </Space>
                          }
                          description={
                            <Space>
                              <span className="text-gray-500">{group.lastMessage}</span>
                            </Space>
                          }
                        />
                      </List.Item>
                    </motion.div>
                  )}
                />
              </div>
              <div >
                <Button
                  type="primary"
                  icon={<UsergroupAddOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  block
                  style={{ 
                    backgroundColor: themeColor, 
                    borderRadius: '10px',
                    height: '40px',
                  }}
                >
                  Create Group
                </Button>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </motion.div>

      <Modal
        title="Create New Group"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setGroupName('');
          setSelectedMembers([]);
        }}
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
    </div>
  );
};

export default ChatPeoples