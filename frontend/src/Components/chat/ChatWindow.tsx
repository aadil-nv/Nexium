import React, { useEffect, useRef } from 'react';
import { Input, Button, Space, Card, Typography } from 'antd';
import { SendOutlined, SmileOutlined, CheckOutlined } from '@ant-design/icons';
import { Message } from '../../interface/ChatInterface';
import useTheme from '../../hooks/useTheme';

const { Text } = Typography;

interface ChatWindowProps {
  messages: Message[];
  messageInput: string;
  setMessageInput: (input: string) => void;
  handleSendMessage: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: boolean) => void;
  scrollToBottom: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  scrollToBottom,
}) => {
  const { isActiveMenu, themeColor, themeMode } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const backgroundColor = themeMode === 'dark' ? '#1f1f1f' : '#ffffff';
  const inputBackgroundColor = themeMode === 'dark' ? '#333' : '#fff';

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '5px',
          backgroundColor: backgroundColor,
          maxHeight: 'calc(85vh - 120px)', // Set maxHeight to make the chat area scrollable
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
              width: '100%',
            }}
          >
            <Card
              size="small"
              style={{
                maxWidth: '80%', // Ensuring the message card is not too wide
                backgroundColor: msg.sender === 'You' ? themeColor : '#f5f5f5',
                color: msg.sender === 'You' ? '#fff' : '#333',
                borderRadius: '8px', // Adding border-radius for rounded corners
                padding: '8px 12px', // Adding padding for better spacing
              }}
            >
              <div style={{ fontSize: '14px', wordWrap: 'break-word' }}>
                {msg.text}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  marginTop: 4,
                  textAlign: 'right',
                  color: msg.sender === 'You' ? '#fff' : '#333',
                }}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.sender === 'You' && (
                  <CheckOutlined style={{ marginLeft: 8, color: '#fff' }} />
                )}
              </div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div
        style={{
          borderTop: '1px solid #f0f0f0',
          padding: '10px 0',
          position: 'fixed',
          bottom: '30px',
          width: '100%',
          zIndex: 10,
          backgroundColor: inputBackgroundColor,
        }}
      >
        <Space.Compact style={{ width: isActiveMenu ? '60%' : '70%', display: 'flex' }}>
          <Button
            icon={<SmileOutlined />}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{ marginRight: 8 }}
          />
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            style={{ flex: 1, borderRadius: '20px', paddingLeft: '12px' }}
          />
          <Button
            type="primary"
            style={{
              backgroundColor: themeColor,
              borderRadius: '20px',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
            icon={<SendOutlined />}
            onClick={handleSendMessage}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default ChatWindow;
