import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Drawer, Avatar, Badge, Button, Skeleton } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import useTheme from '../../hooks/useTheme';
import ChatPeoples from './ChatPeople';
import ChatWindow from './ChatWindow';
import { Employee, Message, Group } from '../../interface/ChatInterface';
import { chatInstance } from '../../services/chatInstance';

const { Header, Content, Sider } = Layout;

interface ChatTarget {
  chatId?: string;
  senderId: string;
  id: string;
  name: string;
  avatar?: string;
  type: 'private' | 'group';
  status?: boolean;
}

const MainLayout: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<ChatTarget | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [siderVisible, setSiderVisible] = useState<boolean>(!isMobile);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { isActiveMenu, themeColor } = useTheme();

  const formatLastSeen = useCallback((date: any) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return 'Invalid date';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  }, []);

  const fetchGroups = async () => {
    try {
      const groupsResponse = await chatInstance.get('/chatService/api/chat/get-all-groups');
      console.log('groupsResponse.data', groupsResponse.data);
      
      if (groupsResponse.data) {
        setGroups(groupsResponse.data);
        const firstEmployee = groupsResponse.data[0];
          setSelectedTarget({
            senderId: firstEmployee.senderId,
            id: firstEmployee.groupId,
            name: firstEmployee.groupName,
            type: 'group',
            status: firstEmployee.status
          });
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetch employees
        const employeesResponse = await chatInstance.get('/chatService/api/chat/get-all-receiver', {
          signal: controller.signal
        });
        if (employeesResponse.data && isMounted) {
          setEmployees(employeesResponse.data);
          const firstEmployee = employeesResponse.data[0];
          setSelectedTarget({
            senderId: firstEmployee.senderId,
            id: firstEmployee.receiverId,
            name: firstEmployee.receiverName,
            avatar: firstEmployee.receiverProfilePicture,
            type: 'private',
            status: firstEmployee.status
          });
        }
  
        // Fetch groups
        await fetchGroups();
        
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching data:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setSiderVisible(!mobile);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const slideVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <Layout style={{ minHeight: '86vh' }}>
      <AnimatePresence mode="wait">
        {isMobile ? (
          <Drawer
            key="mobile-drawer"
            placement="left"
            open={siderVisible}
            onClose={() => setSiderVisible(false)}
            width="100%"
            bodyStyle={{ padding: 0 }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ChatPeoples
                  employees={employees}
                  groups={groups}
                  setSelectedTarget={setSelectedTarget}
                  isMobile={isMobile}
                  setSiderVisible={setSiderVisible}
                  formatLastSeen={formatLastSeen}
                  refreshGroups={fetchGroups}
                />
              </motion.div>
            )}
          </Drawer>
        ) : (
          <Sider width={300} style={{ overflowY: 'auto', backgroundColor: '#fff' }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ChatPeoples
                  employees={employees}
                  groups={groups}
                  setSelectedTarget={setSelectedTarget}
                  isMobile={isMobile}
                  setSiderVisible={setSiderVisible}
                  formatLastSeen={formatLastSeen}
                  refreshGroups={fetchGroups}
                />
              </motion.div>
            )}
          </Sider>
        )}
      </AnimatePresence>

      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
          transition={{ duration: 0.3 }}
        >
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              backgroundColor: themeColor,
              color: '#fff',
            }}
          >
            {selectedTarget && (
              <motion.div
                style={{ display: 'flex', alignItems: 'center' }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Badge dot={selectedTarget.type === 'private' ? selectedTarget.status : undefined}>
                  {selectedTarget.avatar ? (
                    <Avatar src={selectedTarget.avatar} size={40} />
                  ) : (
                    <Avatar size={40}>{selectedTarget.name.charAt(0)}</Avatar>
                  )}
                </Badge>
                <Badge style={{ marginLeft: 16 ,}}>
                  <div className='font-semibold  ' style={{ fontSize: '16px' ,color: '#fff'}}>{selectedTarget.name}</div>
                  {selectedTarget.type === 'group' && (
                    <div style={{ fontSize: '12px', color: '#fff' }}>Group Chat</div>
                  )}
                </Badge>
              </motion.div>
            )}
            {isMobile && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button icon={<MenuOutlined />} onClick={() => setSiderVisible(true)} />
              </motion.div>
            )}
          </Header>
        </motion.div>

        <Content
          style={{
            padding: 16,
            overflowY: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : selectedTarget ? (
              <motion.div
                key="chat-window"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
              >
                <ChatWindow
                  chatId={selectedTarget.chatId}
                  senderId={selectedTarget.senderId}
                  targetId={selectedTarget.id}
                  targetType={selectedTarget.type}
                  messages={messages}
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  scrollToBottom={() => {}}
                />
              </motion.div>
            ) : (
              <motion.div
                key="no-target"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center' }}
              >
                Please select a user or group to start chatting.
              </motion.div>
            )}
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;