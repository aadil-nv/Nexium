export interface Group {
  senderId: string;
  groupId: string;
  groupName: string;
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  avatar?: string;

}

export interface Message {
  senderId: string;
  chatId?: string | undefined;
  receiverId: string;
  id: string;
  targetType: 'private' | 'group';
  text: string;
  timestamp: Date;
  senderName?: string;
  status: MessageStatus;
  readBy: string[];
}
type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';



export interface sendMessage {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  targetType: 'private' | 'group';
  status: 'sent' | 'delivered' | 'read';
}


export interface  Employee {
  chatId: string;
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