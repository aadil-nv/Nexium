import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Space, Modal, Typography } from 'antd';
import { SendOutlined, SmileOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import socket from '../../config/socket';
import { communicationInstance } from '../../services/communicationInstance';

const { Text } = Typography;

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

interface MessageAcknowledgement {
  messageId: string;
  status: MessageStatus;
}

interface ApiMessage {
  text: string;
  senderId: string;
  chatId: string;
  attachments: string[];
  readBy: string[];
  createdAt: string;
  status: MessageStatus;
  receiverId: string[];
  senderName?: string;
  messageId: string;
}

interface Message {
  senderId: string;
  chatId?: string;
  receiverId: string[];
  targetType: 'private' | 'group';
  text: string;
  timestamp: Date;
  senderName?: string;
  status: MessageStatus;
  readBy: string[];
  messageId?: string;
}

interface ChatWindowProps {
  chatId: string;
  senderId: string;
  targetId: string[];
  targetType: 'private' | 'group';
  messageInput: string;
  setMessageInput: (input: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  scrollToBottom: () => void;
  senderName?: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  senderName,
  chatId,
  senderId,
  targetId,
  targetType,
  messageInput,
  setMessageInput,
  showEmojiPicker,
  setShowEmojiPicker,
  scrollToBottom,
}) => {
  const { isActiveMenu, themeColor, themeMode } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState<string | undefined>(undefined);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | undefined>(undefined);

  const backgroundColor = themeMode === 'dark' ? '#1f1f1f' : '#ffffff';
  const inputBackgroundColor = themeMode === 'dark' ? '#333' : '#fff';

  const handleMessageClick = (messageId: string | undefined, isSender: boolean) => {
    if (isSender && messageId) {
      setMessageToDelete(messageId);
      setDeleteModalVisible(true);
      setSelectedMessageId(messageId); // Set selected message ID here

    }
  };

  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false);
    setMessageToDelete(undefined);
  };

  const getMessageStyle = (isSender: boolean, isSelected: boolean) => {
    const baseStyle = {
      maxWidth: '80%',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative' as const,
      transition: 'all 0.2s ease',
      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      cursor: isSender ? 'pointer' : 'default',
      '&:hover': isSender ? {
        opacity: 0.9,
      } : {},
    };

    if (isSender) {
      return {
        ...baseStyle,
        backgroundColor: themeColor,
        color: '#fff',
        marginLeft: 'auto',
        borderBottomRightRadius: '4px',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: themeMode === 'dark' ? '#333' : '#f0f0f0',
      color: themeMode === 'dark' ? '#fff' : '#333',
      marginRight: 'auto',
      borderBottomLeftRadius: '4px',
    };
  };

  const handleDeleteMessage = async () => {
    try {
      if (!messageToDelete) return;
      await communicationInstance.delete(`/communication-service/api/message/delete-message/${messageToDelete}`);
      socket.emit('messageDeleted', {chatId,messageId: messageToDelete, senderId});
      setChatMessages(prev => prev.filter(msg => msg.messageId !== messageToDelete));
      handleDeleteModalClose();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;    

    const newMessage: Message = {
      chatId,
      receiverId: targetId,
      targetType,
      text: messageInput.trim(),
      timestamp: new Date(),
      senderId: senderId,
      status: 'sending',
      senderName: '',
      readBy: [senderId],
      messageId: `temp-${Date.now()}`
    };

    setChatMessages((prev) => [...prev, newMessage]);

    const apiMessage = {
      senderId: senderId,
      receiverId: targetId,
      text: messageInput.trim(),
      chatId: chatId,
      attachments: [],
      readBy: [senderId],
      targetType: targetType,
      createdAt: new Date().toISOString(),
      status: 'sending' as MessageStatus,
      senderName: senderName
    };

    socket.emit('sendMessage', apiMessage, () => {});
    socket.on('messageAcknowledgement', (acknowledgement: MessageAcknowledgement) => {
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === newMessage.messageId
            ? { ...msg, messageId: acknowledgement.messageId, status: acknowledgement.status }
            : msg
        )
      );
    })
    setMessageInput('');
    scrollToBottom();
  };

  const convertApiMessageToMessage = (apiMessage: ApiMessage): Message => {
    
    const status: MessageStatus = apiMessage.readBy.includes(targetId[0]) ? 'read' : 'delivered';

    return {
      chatId: apiMessage.chatId,
      receiverId: Array.isArray(apiMessage.receiverId) ? apiMessage.receiverId : [apiMessage.receiverId],
      senderId: apiMessage.senderId,
      targetType: targetType,
      text: apiMessage.text,
      timestamp: new Date(apiMessage.createdAt),
      status: status,
      senderName: apiMessage.senderName,
      readBy: apiMessage.readBy,
      messageId: apiMessage.messageId,
    };
  };

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        setLoading(true);
        const response = await communicationInstance.get<ApiMessage[]>(`/communication-service/api/message/get-all-messages/${chatId}`);
          
        const convertedMessages = response.data.map(convertApiMessageToMessage);
        const sortedMessages = convertedMessages.sort((a, b) =>
          a.timestamp.getTime() - b.timestamp.getTime()
        );

        setChatMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchAllMessages();
    }
  }, [chatId, senderId, targetId, targetType]);

  useEffect(() => {
    socket.emit('joinChat', senderId);

    socket.on('receiveMessage', (newMessage: ApiMessage) => {
      if (newMessage.chatId === chatId) {
        const convertedMessage = convertApiMessageToMessage(newMessage);
        setChatMessages((prev) => [...prev, convertedMessage]);
        scrollToBottom();

        socket.emit('messageReceived', {
          senderId,
          chatId: newMessage.chatId,
          receiverId: senderId,
          targetType,
        });
      }
    });

    socket.on('messageDeleted', (data: { messageId: string }) => {
      console.log('Message deleted:', data.messageId);
      setChatMessages(prev => prev.filter(msg => msg.messageId !== data.messageId));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageStatus');
      socket.off('userTyping');
      socket.off('messageDeleted');
    };
  }, [chatId, senderId, targetId, targetType, scrollToBottom]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: backgroundColor,
          maxHeight: 'calc(85vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {loading ? (
          <div className="flex justify-center w-full p-6">
            <div className="animate-pulse text-gray-500">Loading messages...</div>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex justify-center w-full p-6 text-gray-500">
            Start a new conversation!
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isSender = msg.senderId === senderId;
            // const isSelected = msg.messageId === selectedMessageId;
            
            return (
              <div
                key={msg.messageId}
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isSender ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                {!isSender && (
                  <div style={{ 
                    fontSize: '12px',
                    color: themeMode === 'dark' ? '#aaa' : '#666',
                    marginBottom: '4px',
                    paddingLeft: '12px'
                  }}>
                    {msg.senderName || 'User'}
                  </div>
                )}
               <div
  key={msg.messageId}
  onClick={() => handleMessageClick(msg.messageId, isSender)}
  style={getMessageStyle(isSender, msg.messageId === selectedMessageId)}
>
                  <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    color: isSender ? 'rgba(255,255,255,0.7)' : '#888',
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    {isSender && (
                      <Space style={{ marginLeft: '8px' }}>
                        {msg.status === 'sending' && <span>•••</span>}
                        {msg.status === 'sent' && <CheckOutlined style={{ fontSize: '12px' }} />}
                        {msg.status === 'delivered' && (
                          <>
                            <CheckOutlined style={{ fontSize: '12px' }} />
                            <CheckOutlined style={{ fontSize: '12px', marginLeft: -12 }} />
                          </>
                        )}
                      </Space>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          borderTop: `1px solid ${themeMode === 'dark' ? '#333' : '#f0f0f0'}`,
          padding: '16px',
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
            style={{ 
              marginRight: '8px',
              borderRadius: '20px',
            }}
          />
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            style={{ 
              flex: 1, 
              borderRadius: '20px', 
              padding: '8px 16px',
              backgroundColor: themeMode === 'dark' ? '#444' : '#fff',
              color: themeMode === 'dark' ? '#fff' : '#333',
            }}
          />
          <Button
            type="primary"
            style={{
              backgroundColor: themeColor,
              borderRadius: '20px',
              padding: '0 24px',
              marginLeft: '8px',
            }}
            icon={<SendOutlined />}
            onClick={handleSendMessage}
          />
        </Space.Compact>
      </div>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DeleteOutlined style={{ color: '#ff4d4f' }} />
            <Text>Delete Message</Text>
          </div>
        }
        open={deleteModalVisible}
        onCancel={handleDeleteModalClose}
        footer={[
          <Button key="cancel" onClick={handleDeleteModalClose}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteMessage}
          >
            Delete
          </Button>,
        ]}
        centered
      >
        <Text>Are you sure you want to delete this message? This action cannot be undone.</Text>
      </Modal>
    </div>
  );
};

export default ChatWindow;