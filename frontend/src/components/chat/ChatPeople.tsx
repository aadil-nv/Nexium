import React, { useState, useEffect } from 'react';
import { List, Badge, Avatar, Button, Space, Typography, message, Modal, Input, Checkbox, Tabs } from 'antd';
import { Employee, Group } from '../../interface/ChatInterface';
import { UsergroupAddOutlined, TeamOutlined, UserOutlined, MessageOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import { motion } from 'framer-motion';
import { createChatAPI, createGroupAPI, fetchAvailablePeopleAPI } from '../../api/communicationApi';

const { Title } = Typography;
const { TabPane } = Tabs;

interface ChatTarget {
  chatId: string;
  senderId: string;
  receiverId: string[];
  id: string;
  name: string;
  avatar?: string;
  type: 'private' | 'group';
  status?: boolean;
  businessOwnerId?: string
  lastSeen?: string
  lastMessage?: string
  lastMessageTime?: Date
}

interface ChatPeoplesProps {
  employees: Employee[];
  groups: Group[];
  setSelectedTarget: (target: ChatTarget) => void;
  isMobile: boolean;
  formatLastSeen: (date: Date) => string;
  setSiderVisible: (visible: boolean) => void;
  refreshGroups: () => Promise<void>;
  businessOwnerId?: string
}

const ChatPeoples: React.FC<ChatPeoplesProps> = ({employees: initialEmployees,groups,setSelectedTarget,isMobile,formatLastSeen,setSiderVisible,refreshGroups,businessOwnerId}) => {

  const { themeColor } = useTheme();
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isStartChatModalVisible, setIsStartChatModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [availablePeople, setAvailablePeople] = useState<Employee[]>([]);
  const [existingChats, setExistingChats] = useState<Employee[]>(initialEmployees);

  useEffect(() => {
    fetchAvailablePeople();
  }, []);

  useEffect(() => {
    setExistingChats(initialEmployees);
  }, [initialEmployees]);

  const fetchAvailablePeople = async () => {
    const people = await fetchAvailablePeopleAPI();
    setAvailablePeople(people);
  };

  const handleUserSelect = async (emp: Employee) => {
    try {
      const chatData = await createChatAPI(emp.receiverId);
  
      setExistingChats(prevChats => {
        if (!prevChats.some(chat => chat.receiverId === emp.receiverId)) {
          return [...prevChats, emp];
        }
        return prevChats;
      });
  
      setAvailablePeople(prevPeople => 
        prevPeople.filter(person => person.receiverId !== emp.receiverId)
      );
      
      setSelectedTarget({
        chatId: chatData.chatId,
        senderId: emp.senderId,
        receiverId: [emp.receiverId],
        id: emp.receiverId,
        name: emp.receiverName,
        avatar: emp.receiverProfilePicture,
        type: 'private',
        status: emp.status,
        businessOwnerId: emp.businessOwnerId
      });
  
      if (isMobile) setSiderVisible(false);
      setIsStartChatModalVisible(false);
    } catch (error) {
      console.error('Error handling user select:', error);
    }
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedTarget({
      chatId: group.groupId,
      senderId: group.senderId,
      receiverId: group.participants,
      id: group.groupId,
      name: group.groupName,
      avatar: group.avatar,
      type: 'group',
      businessOwnerId: businessOwnerId
    });
    if (isMobile) setSiderVisible(false);
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
      await createGroupAPI(groupName, selectedMembers);
      await refreshGroups();
      message.success('Group created successfully');
      setIsGroupModalVisible(false);
      setGroupName('');
      setSelectedMembers([]);
      setActiveTab('2');
    } catch (error) {
      console.error('Error handling group creation:', error);
    } finally {
      setLoading(false);
    }
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
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 340px)' }}>
              <List
                dataSource={existingChats}
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
                            {emp.status ? (
                              <span className="text-xs text-green-500">
                                <Space><CheckOutlined /> Active now</Space>
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">
                                <Space><ClockCircleOutlined /> Offline</Space>
                              </span>
                            )}
                          </Space>
                        }
                        description={
                          !emp.status && emp.lastMessageTime && (
                            <span className="text-xs text-gray-400">Lats Messaged at :
                              {formatLastSeen(emp.lastMessageTime)}
                            </span>
                          )
                        }
                      />
                    </List.Item>
                  </motion.div>
                )}
              />
            </div>
            <Button
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => setIsStartChatModalVisible(true)}
              block
              style={{ 
                backgroundColor: themeColor, 
                borderRadius: '10px',
                height: '40px',
              }}
            >
              Start New Chat
            </Button>
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
                              <span className="text-xs text-gray-500">{group.participants.length} members</span>
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
              <Button
                type="primary"
                icon={<UsergroupAddOutlined />}
                onClick={() => setIsGroupModalVisible(true)}
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
          </TabPane>
        </Tabs>
      </motion.div>

      <Modal
        title="Create New Group"
        open={isGroupModalVisible}
        onCancel={() => {
          setIsGroupModalVisible(false);
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
            dataSource={availablePeople}
            renderItem={(emp) => (
              <List.Item>
                <Checkbox
                  checked={selectedMembers.includes(emp.receiverId)}
                  onChange={() => toggleMember(emp.receiverId)}
                  className="w-full"
                >
                  <Space>
                    <Avatar src={emp.receiverProfilePicture} size={32} />
                    <span>{emp.receiverName}</span>
                  </Space>
                </Checkbox>
              </List.Item>
            )}
          />
        </Space>
      </Modal>

      <Modal
        title="Start New Chat"
        open={isStartChatModalVisible}
        onCancel={() => setIsStartChatModalVisible(false)}
        footer={null}
      >
        <List
          className="max-h-[400px] overflow-auto"
          dataSource={availablePeople}
          renderItem={(person) => (
            <List.Item
              onClick={() => handleUserSelect(person)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <List.Item.Meta
                avatar={
                  <Badge dot status={person.status ? 'success' : 'default'}>
                    <Avatar src={person.receiverProfilePicture} size={40} />
                  </Badge>
                }
                title={person.receiverName}
                description={
                  person.status ? (
                    <span className="text-green-500">
                      <Space><CheckOutlined /> Active now</Space>
                    </span>
                  ) : (
                    <span className="text-gray-500">{person.lastMessage || 'No messages yet'}</span>
                  )
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ChatPeoples;