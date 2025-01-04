export interface Message {
    id: number;
    text: string;
    sender: string;
    timestamp: Date;
    status: 'sent' | 'received' | 'read';
  }
  
 export interface Employee {
  receiverId: string;
  receiverName: string;
  status: boolean
  lastSeen: Date
  receiverProfilePicture: string;
}