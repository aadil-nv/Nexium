import { Namespace, Socket } from "socket.io";
import IChatService from "../service/interface/IChatService";
import IMessageService from "../service/interface/IMessageService";
import container from "./inversify";
import INotificationService from "../service/interface/INotificationService";

interface MessageData {
  chatId: string;
  senderId: string;
  receiverId: string[];
  text: string;
  targetType: "private" | "group";
  senderName: string;
  status: "sent" | "sending" | "delivered" | "read";
  attachments?: string;
  createdAt?: Date;
  readBy?: string[];
  messageId?: string;
}

interface DeleteMessageData {
  chatId: string;
  messageId: string;
  senderId: string;
}

const chatService = container.get<IChatService>("IChatService");
const messageService = container.get<IMessageService>("IMessageService");
const notificationService = container.get<INotificationService>("INotificationService");


// Active users list with Set to prevent duplicates
const activeUsers = new Set<{ userId: string; socketId: string }>();

export const initializeChatSocket = (chatNamespace: Namespace) => {
  chatNamespace.on("connection", (socket: Socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    // Join a specific chat room and add user to the active users list
    socket.on("joinChat", (userId: string) => {
      console.log(`Room joined: ${userId}`);
      
      // Remove any existing socket connections for this user
      for (const user of activeUsers) {
        if (user.userId === userId) {
          activeUsers.delete(user);
        }
      }
      
      // Add new connection
      activeUsers.add({ userId, socketId: socket.id });

      socket.join(userId);
    });

    // Handle message deletion
    socket.on("messageDeleted", async (data: DeleteMessageData) => {
      try {
        console.log(`Delete message request received:`, data);

        // Delete message from database
        await messageService.deleteMessage(data.messageId);
        console.log(`Message ${data.messageId} deleted from database`.bgRed.bold);

        // Notify all users in the chat about the deletion
        const chatParticipants = await chatService.getChatParticipants(data.chatId);
        console.log(`Chat participants:`.bgYellow, chatParticipants);

        console.log(`Active users:`.bgMagenta, activeUsers);
        
        
        
        for (const participantId of chatParticipants) {
          const participant = Array.from(activeUsers).find(user => 
              user.userId === participantId.toString() // Convert ObjectId to string for comparison
          );
          if (participant) {
              console.log(`Sending deletion notification to user ${participantId.toString()}`.bgBlue);
              socket.to(participant.socketId).emit("messageDeleted", {
                  messageId: data.messageId,
                  chatId: data.chatId,
              });
              console.log(`Deletion notification sent to user ${participantId.toString()}`);
          }
      }
      

      } catch (error) {
        console.error(`Error handling messageDeleted event:`, error);
        socket.emit("deleteMessageError", {
          messageId: data.messageId,
          error: "Failed to delete message"
        });
      }
    });

    // Handle sending a text message
    socket.on("sendMessage", async (data: MessageData) => {
      try {
        console.log(`New message received:`, data);

        if (!Array.isArray(data.receiverId) || data.receiverId.length === 0) {
          console.log(`Invalid or missing receiverId`, data.receiverId);
          return;
        }

        // Save message once
        const savedMessage = await messageService.createMessage(data.senderId,data.chatId,data.text);
        console.log(`Message saved to database:`.bgYellow.bold, savedMessage);
        

        console.log(`Message saved to database`);

        // Send acknowledgment to sender once
        socket.emit("messageAcknowledgement", {
          messageId: savedMessage.messageId,
          status: "sent"
        });

        // Prepare message payload
        const messagePayload = {
          messageId: savedMessage.messageId,
          senderId: data.senderId,
          text: data.text,
          chatId: data.chatId,
          attachments: data.attachments,
          targetType: data.targetType,
          status: "delivered",
          createdAt: data.createdAt || new Date(),
          readBy: data.readBy || [data.senderId],
          senderName: savedMessage.senderName,
        };

        // Send to each recipient once
        for (const recipientId of data.receiverId) {
          const recipient = Array.from(activeUsers).find(user => user.userId === recipientId);
          if (recipient) {
            // Use socket.to() instead of namespace.to() to prevent duplicate emissions
            socket.to(recipient.socketId).emit("receiveMessage", {
              ...messagePayload,
              receiverId: recipientId
            });
            console.log(`Message sent to user with socket ID: ${recipient.socketId}`);
            const notification = {
              userId: recipientId,
              message: `New message from ${data.senderName}`,
              type: "message",
              createdAt: new Date(),
            };
            socket.to(recipient.socketId).emit("notification", notification);
          } else if (!recipient) {
            console.log(`Recipient ${recipientId} is not active. Saving notification. ${data}`);
            await notificationService.saveNotification(recipientId,data.text,"info",`New message from ${data.senderName}`);
          }
        }
      } catch (error) {
        console.error(`Error handling sendMessage event:`, error);
        socket.emit("messageSendError", {
          error: "Failed to send message"
        });
      }
    });

    // Handle message received acknowledgment
    socket.on("messageReceived", (data: { 
      senderId: string;
      chatId: string;
      receiverId: string;
      targetType: string;
    }) => {
      try {
        const sender = Array.from(activeUsers).find(user => user.userId === data.senderId);
        if (sender) {
          // Use socket.to() instead of namespace.to()
          socket.to(sender.socketId).emit("messageStatus", {
            chatId: data.chatId,
            receiverId: data.receiverId,
            status: "delivered"
          });
        }
      } catch (error) {
        console.error(`Error handling messageReceived event:`, error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      for (const user of activeUsers) {
        if (user.socketId === socket.id) {
          activeUsers.delete(user);
          console.log(`User ${user.userId} removed from active users list.`);
          break;
        }
      }
      console.log(`User disconnected from /chatService namespace: ${socket.id}`);
    });
  });
};