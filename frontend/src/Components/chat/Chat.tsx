import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Drawer, Avatar, Badge, Button, Skeleton } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import useTheme from '../../hooks/useTheme';
import ChatPeoples from './ChatPeople';
import ChatWindow from './ChatWindow';
import { Employee, Message } from '../../interface/ChatInterface';
import { chatInstance } from '../../services/chatInstance';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [siderVisible, setSiderVisible] = useState<boolean>(!isMobile);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { isActiveMenu, themeColor } = useTheme();

  // Memoized format function to prevent unnecessary recalculations
  const formatLastSeen = useCallback((date: Date | undefined) => {
    if (!date || isNaN(date.getTime())) return 'Invalid date';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  }, []);

  // Optimized data fetching with error handling and caching
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const cachedData = sessionStorage.getItem('chatEmployees');
        
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (isMounted) {
            setEmployees(parsedData);
            setSelectedUser(parsedData[0]);
            setLoading(false);
          }
        }

        const response = await chatInstance.get('/chatService/api/chat/get-all-receiver', {
          signal: controller.signal
        });

        if (isMounted) {
          setEmployees(response.data);
          if (response.data.length > 0) {
            setSelectedUser(response.data[0]);
          }
          sessionStorage.setItem('chatEmployees', JSON.stringify(response.data));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching employees:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Debounced resize handler
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

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageInput,
      sender: 'You',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  }, [messageInput]);

  // Animation variants
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
                  setSelectedUser={setSelectedUser}
                  isMobile={isMobile}
                  setSiderVisible={setSiderVisible}
                  formatLastSeen={formatLastSeen}
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
                  setSelectedUser={setSelectedUser}
                  isMobile={isMobile}
                  setSiderVisible={setSiderVisible}
                  formatLastSeen={formatLastSeen}
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
            {selectedUser && (
              <motion.div
                style={{ display: 'flex', alignItems: 'center' }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Badge dot={selectedUser.status}>
                  <Avatar src={selectedUser.receiverProfilePicture} size={40} />
                </Badge>
                <div style={{ marginLeft: 16 }}>
                  <div>{selectedUser.receiverName}</div>
                </div>
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
            ) : selectedUser ? (
              <motion.div
                key="chat-window"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
              >
                <ChatWindow
                  messages={messages}
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  handleSendMessage={handleSendMessage}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  scrollToBottom={() => {}}
                />
              </motion.div>
            ) : (
              <motion.div
                key="no-user"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center' }}
              >
                Please select a user to start chatting.
              </motion.div>
            )}
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;