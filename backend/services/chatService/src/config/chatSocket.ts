import { Namespace, Socket } from "socket.io";

export interface MessageData {
  id: string;
  targetId: string;
  targetType: 'private' | 'group';
  text: string;
  timestamp: Date;
  sender: string;
  senderName?: string;
  status: 'sent' | 'delivered' | 'read';
}

export const initializeChatSocket = (chatNamespace: Namespace) => {
  console.log(`Initializing chat socket on /chatService namespace`.bgMagenta.bold);

  // Initialize the chat namespace with connection
  chatNamespace.on("connection", (socket: Socket) => {
    console.log(`User connected to /chatService namespace: ${socket.id}`.america.bold);

    // Listen for chat messages
    socket.on("sendMessage", (data: MessageData) => {
      console.log(`Message from ${data.id} to ${data.targetId}: ${data.text}`.bgMagenta);
      
      // Emit message to the target user
      chatNamespace.to(data.targetId).emit("receiveMessage", {
        senderId: data.id,
        message: data.text,
      });
    });

    // Join a user-specific room for private messages
    socket.on("joinRoom", (userId: string) => {
      console.log(`User ${userId} joining room in /chatService namespace`.bgWhite.bold);
      
      socket.join(userId);
      console.log(`User ${userId} joined room in /chatService namespace`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected from /chatService namespace: ${socket.id}`);
    });
  });
};
