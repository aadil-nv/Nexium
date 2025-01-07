import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Space, Card, Typography } from 'antd';
import { SendOutlined, SmileOutlined, CheckOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import socket from '../../config/socket';
import { chatInstance } from '../../services/chatInstance';
import {Message ,ChatWindowProps} from "../../interface/ChatInterface"



const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  senderId,
  targetId,
  targetType,
  messages,
  messageInput,
  setMessageInput,
  showEmojiPicker,
  setShowEmojiPicker,
  scrollToBottom,
}) => {

  console.log("senderId:", senderId);
  console.log("targetId:", targetId);
  console.log("targetType:", targetType);
  console.log("chatId:", chatId);
  
  
  const { isActiveMenu, themeColor, themeMode } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const backgroundColor = themeMode === 'dark' ? '#1f1f1f' : '#ffffff';
  const inputBackgroundColor = themeMode === 'dark' ? '#333' : '#fff';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const endpoint = targetType === 'group' 
          ? `/chatService/api/chat/group-messages/${targetId}`
          : `/chatService/api/chat/messages/${targetId}`;
        
        const response = await chatInstance.get<Message[]>(endpoint);
        setChatMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (targetId) {
      fetchMessages();
    }
  }, [targetId, targetType]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    socket.on('newMessage', (newMessage: Message) => {
      setChatMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      chatId ,
      id: senderId, // Generate temporary ID
      targetId,
      targetType,
      text: messageInput,
      timestamp: new Date(),
      sender: senderId,
      status: 'sent',
      senderName: 'You' // Optional: Add if needed for consistency
    };

    // Emit message via Socket.IO
    socket.emit('sendMessage', newMessage);

    // Update the chat messages state locally
    setChatMessages((prev) => [...prev, newMessage]);
    setMessageInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '5px',
          backgroundColor: backgroundColor,
          maxHeight: 'calc(85vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {chatMessages.map((msg) => (
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
                maxWidth: '80%',
                backgroundColor: msg.sender === 'You' ? themeColor : '#f5f5f5',
                color: msg.sender === 'You' ? '#fff' : '#333',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
            >
              {targetType === 'group' && msg.sender !== 'You' && msg.senderName && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  {msg.senderName}
                </div>
              )}
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
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                {msg.sender === 'You' && (
                  <CheckOutlined style={{ marginLeft: 8, color: '#fff' }} />
                )}
              </div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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