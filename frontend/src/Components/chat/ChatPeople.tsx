import React, { useState, useEffect } from 'react';
import { List, Badge, Avatar, Button, Space, Typography, message, Tabs } from 'antd';
import { Employee, Group } from '../../interface/ChatInterface';
import { UsergroupAddOutlined, ClockCircleOutlined, CheckOutlined, TeamOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import { chatInstance } from '../../services/chatInstance';
import { motion } from 'framer-motion';
import NewChatModal from './NewChatModal';
import NewGroupModal from './NewGroupModal';

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
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [chatId, setChatId] = useState<string>('');
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    try {
      const response = await chatInstance.get('/chatService/api/chat/get-all-receiver');
      setAllEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Failed to fetch employees');
    }
  };

  const handleUserSelect = async (emp: Employee) => {
    try {
      const response = await chatInstance.post(`/chatService/api/chat/create-chat/${emp.receiverId}`);
      const newChatId = response.data.chatId;
      setChatId(newChatId);

      setSelectedTarget({
        chatId: newChatId,
        senderId: emp.senderId,
        id: emp.receiverId,
        name: emp.receiverName,
        avatar: emp.receiverProfilePicture,
        type: 'private',
        status: emp.status
      });

      if (isMobile) {
        setSiderVisible(false);
      }
      setIsChatModalVisible(false);
    } catch (error) {
      console.error('Error creating chat:', error);
      message.error('Failed to create chat');
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
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 340px)' }}>
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
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 340px)' }}>
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
          </TabPane>
        </Tabs>

        <div 
          style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            backgroundColor: 'white',
            borderTop: '1px solid #f0f0f0'
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {activeTab === '2' && (
              <Button
                type="primary"
                icon={<UsergroupAddOutlined />}
                onClick={() => setIsGroupModalVisible(true)}
                style={{ 
                  backgroundColor: themeColor, 
                  borderRadius: '10px',
                  height: '40px',
                }}
                block
              >
                Create Group
              </Button>
            )}
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsChatModalVisible(true)}
              style={{ 
                backgroundColor: themeColor, 
                borderRadius: '10px',
                height: '40px',
              }}
              block
            >
              Start New Chat
            </Button>
          </Space>
        </div>
      </motion.div>

      <NewGroupModal
        isVisible={isGroupModalVisible}
        onClose={() => setIsGroupModalVisible(false)}
        employees={employees}
        themeColor={themeColor}
        refreshGroups={refreshGroups}
        setActiveTab={setActiveTab}
      />

      <NewChatModal
        isVisible={isChatModalVisible}
        onClose={() => setIsChatModalVisible(false)}
        allEmployees={allEmployees}
        handleUserSelect={handleUserSelect}
      />
    </div>
  );
};

export default ChatPeoples