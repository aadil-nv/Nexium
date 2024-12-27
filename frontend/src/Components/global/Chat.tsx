import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, Avatar, Typography, List, Space } from 'antd';
import { SendOutlined, SmileOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Header, Content, Sider } = Layout;
const { TextArea } = Input;

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers] = useState(['Alice', 'Bob', 'Charlie']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'You',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Layout style={{ height: '100vh' }}>
      {/* Sidebar with online users */}
      <Sider width={300} style={{ background: '#f0f0f0', borderRight: '1px solid #ddd' }}>
        <Typography.Title level={4}>Online Users</Typography.Title>
        <List
          dataSource={onlineUsers}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{user[0]}</Avatar>}
                title={user}
              />
            </List.Item>
          )}
        />
        <Button
          type="primary"
          icon={<UsergroupAddOutlined />}
          style={{ width: '100%', marginTop: 'auto' }}
        >
          Create Group
        </Button>
      </Sider>

      {/* Main chat content */}
      <Layout>
        <Header style={{ background: '#1976d2', color: 'white', padding: '10px' }}>
          <Typography.Title level={4} style={{ color: 'white' }}>
            Chat Room
          </Typography.Title>
        </Header>

        <Content style={{ padding: '20px', overflowY: 'auto', height: 'calc(100vh - 130px)' }}>
          <div style={{ marginBottom: '16px' }}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: msg.sender === 'You' ? '#1976d2' : '#e0e0e0',
                  color: msg.sender === 'You' ? '#fff' : '#000',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  maxWidth: '70%',
                  alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                }}
              >
                <Typography.Text>{msg.text}</Typography.Text>
                <Typography.Text style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {msg.timestamp.toLocaleTimeString()}
                </Typography.Text>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%' }}>
              <Button
                icon={<SmileOutlined />}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{ borderRadius: '20px' }}
              />
              {showEmojiPicker && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '20px',
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {['😊', '😂', '❤️', '👍', '🎉', '😢'].map((emoji) => (
                    <Button
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      style={{
                        margin: '5px',
                        fontSize: '24px',
                        cursor: 'pointer',
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleSendMessage}
                rows={2}
                placeholder="Type a message..."
                style={{ flex: 1 }}
              />
              <Button
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                type="primary"
                style={{ borderRadius: '20px' }}
              />
            </Space>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
