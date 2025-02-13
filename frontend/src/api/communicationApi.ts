import {communicationInstance} from "../services/communicationInstance" 
import { message, Modal } from 'antd';
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
  type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';


export const fetchAllChatsAPI = async (signal?: AbortSignal) => {
    try {
      const response = await communicationInstance.get('/communication-service/api/chat/get-all-chats', { signal });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  };
  

  export const fetchAvailablePeopleAPI = async () => {
    try {
      const response = await communicationInstance.get('/communication-service/api/chat/get-all-receiver');
      return response.data;
    } catch (error) {
      console.error('Error fetching available people:', error);
      message.error('Failed to fetch available people');
      return [];
    }
  };
  

  export const createChatAPI = async (receiverId: string) => {
    try {
      const response = await communicationInstance.post(`/communication-service/api/chat/create-chat/${receiverId}`);
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      message.error('Failed to create chat. Please try again.');
      throw error;
    }
  };
  
 export const deleteMessageAPI = async (messageId: string) => {
    try {
      await communicationInstance.delete(`/communication-service/api/message/delete-message/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };
  ;
  
export const fetchAllMessagesAPI = async (chatId: string) => {
    try {
      const response = await communicationInstance.get<ApiMessage[]>(`/communication-service/api/message/get-all-messages/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return null;
    }
  };
  
  
  
//todo================================ GROUP API ===============================================
export const fetchGroupMembersAPI = async (groupId: string) => {
    if (!groupId) return;
    
    try {
      const response = await communicationInstance.get(`/communication-service/api/chat/get-all-groupmembers/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  };
  

  export const fetchAllGroupsAPI = async () => {
    try {
      const response = await communicationInstance.get('/communication-service/api/chat/get-all-groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  };
  
 export const fetchGroupDetailsAPI = async (groupId: string) => {
    try {
      const response = await communicationInstance.get(`/communication-service/api/chat/get-group-detailes/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    }
  };;
  
 export const deleteGroupAPI = async (groupId: string) => {
    try {
      await communicationInstance.delete(`/communication-service/api/chat/delete-group/${groupId}`);
    } catch (error) {
      console.error('Error deleting group:', error);
      Modal.error({
        title: 'Error',
        content: 'Failed to delete the group. Please try again.',
      });
      throw error;
    }
  };
  
  
  export const createGroupAPI = async (groupName: string, members: string[]) => {
    try {
      const response = await communicationInstance.post('/communication-service/api/chat/create-group', {
        groupName,
        members
      });
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      message.error('Failed to create group. Please try again.');
      throw error;
    }
  };
  
  