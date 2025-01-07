import { Namespace, Socket } from "socket.io";
import IChatService from "../service/interface/IChatService"; // Import the chat service interface
import container from "./inversify";

export interface MessageData {
  chatId: string;
  id: string;
  targetId: string;
  targetType: 'private' | 'group';
  text: string;
  timestamp: Date;
  sender: string;
  senderName?: string;
  status: 'sent' | 'delivered' | 'read';
}

const chatService = container.get<IChatService>("IChatService");


export const initializeChatSocket = (chatNamespace: Namespace) => {
  console.log(`Initializing chat socket on /chatService namespace`.bgMagenta.bold);

  // Listen for new connections to the chat namespace
  chatNamespace.on("connection", (socket: Socket) => {
    console.log(`User connected to /chatService namespace: ${socket.id}`.america.bold);

    // Listen for chat messages
    socket.on("sendMessage", async (data: MessageData) => {
      console.log(`Message from ${data.id} to ${data.targetId}: ${data.text} chatId is ${data.chatId} targetType is ${data.targetType}`.bgMagenta);

      // Check if chatId is provided; if not, call the service layer to find or create it
      if (!data.chatId) {
        try {
          // Call the service to find or create the chat and assign chatId
          data.chatId = await chatService.findChatId(data.id, data.targetId, data.targetType);
          console.log(`Found or created chatId: ${data.chatId}`);
        } catch (error) {
          console.error("Error finding chatId:", error);
          socket.emit("error", { message: "Unable to find or create chat." });
          return; // Exit early if chatId couldn't be found or created
        }
      }

      // Emit the message to the target user with the valid chatId
      chatNamespace.to(data.targetId).emit("receiveMessage", {
        senderId: data.id,
        message: data.text,
        chatId: data.chatId, // Include the chatId in the message
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
