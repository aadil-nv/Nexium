export interface Group {
  senderId: string;
  groupId: string;
  groupName: string;
  members: string[];
  lastMessage: string;
  timestamp: Date;
  avatar?: string;
}

export interface Message {
  chatId?: string;
  id: string;
  targetId: string;
  targetType: 'private' | 'group';
  text: string;
  timestamp: Date;
  sender: string;
  senderName?: string;
  status: 'sent' | 'delivered' | 'read';
}


export interface sendMessage {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  targetType: 'private' | 'group';
  status: 'sent' | 'delivered' | 'read';
}


export interface Employee {
  senderId: string;
  receiverId: string;
  receiverName: string;
  receiverPosition?: string;
  receiverProfilePicture?: string;
  status: boolean;
  lastSeen: Date;
}

export interface ChatWindowProps {
  chatId: string | undefined;
  senderId: string;
  targetId: string;
  targetType: 'private' | 'group';
  messages: Message[];
  messageInput: string;
  setMessageInput: (input: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: boolean) => void;
  scrollToBottom: () => void;
}