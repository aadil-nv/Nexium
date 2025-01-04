import { Server, Socket } from "socket.io";

interface MessageData {
  senderId: string;
  receiverId: string;
  message: string;
}

export const initializeChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for chat messages
    socket.on("sendMessage", (data: MessageData) => {
      console.log(`Message from ${data.senderId} to ${data.receiverId}: ${data.message}`);
      io.to(data.receiverId).emit("receiveMessage", {
        senderId: data.senderId,
        message: data.message,
      });
    });

    // Join a user-specific room for private messages
    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
