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
  businessOwnerId?: string;
}

interface DeleteMessageData {
  chatId: string;
  messageId: string;
  senderId: string;
  businessOwnerId: string;
}

const chatService = container.get<IChatService>("IChatService");
const messageService = container.get<IMessageService>("IMessageService");
const notificationService = container.get<INotificationService>("INotificationService");


const activeUsers = new Set<{ userId: string; socketId: string }>();

export const initializeChatSocket = (chatNamespace: Namespace) => {
// console.log(`activeUsers====================`.bgMagenta ,activeUsers);

  chatNamespace.on("connection", (socket: Socket) => {
    console.log(`Socket ${socket.id} connected`.bgGreen);
    
    socket.on("joinChat", (userId: string ,businessOwnerId: string) => {
      // console.log(`User ${userId} joined chat`.bgBlue);
      // console.log(`activeUsers====================`.bgMagenta ,activeUsers);
      // console.log(`businessOwnerId====================`.bgMagenta,businessOwnerId);
      
      
      
      for (const user of activeUsers) {
        if (user.userId === userId) {
          activeUsers.delete(user);
        }
      }
      activeUsers.add({ userId, socketId: socket.id });
      // chatService.updateLastSeen(userId ,businessOwnerId);
      socket.join(userId);
    });

  

    socket.on("messageDeleted", async (data: DeleteMessageData) => {
      console.log(`Received messageDeleted event for messageId: `.bgRed + data);
      try {
        await messageService.deleteMessage(data.messageId , data.businessOwnerId); 

        const chatParticipants = await chatService.getChatParticipants(data.chatId ,data.businessOwnerId); 
        
        for (const participantId of chatParticipants) {
          const participant = Array.from(activeUsers).find(user => 
              user.userId === participantId.toString() 
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



    socket.on("sendMessage", async (data: MessageData) => {
      console.log(`Received sendMessage event: ${data}`.bgRed , data);
      
      try {

        if (!Array.isArray(data.receiverId) || data.receiverId.length === 0) {
          console.log(`Invalid or missing receiverId`, data.receiverId);
          return;
        }

        const savedMessage = await messageService.createMessage(data.senderId,data.chatId,data.text ,data.businessOwnerId as string) //!======3333333333333333333333333
        
        socket.emit("messageAcknowledgement", {
          messageId: savedMessage.messageId,
          status: "sent"
        });

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
          senderName: data.senderName,
          // businessOwnerId: savedMessage.businessOwnerId
        };
        console.log(`"messagePayload"`.bgYellow.bold, messagePayload);
        

        for (const recipientId of data.receiverId) {
          const recipient = Array.from(activeUsers).find(user => user.userId === recipientId);
          if (recipient) {
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
            await notificationService.saveNotification(recipientId,data.text,"info",`New message from ${data.senderName }`,data.businessOwnerId as string); //!======444444444444444444444444444444
          }
        }
      } catch (error) {
        console.error(`Error handling sendMessage event:`, error);
        socket.emit("messageSendError", {
          error: "Failed to send message"
        });
      }
    });



    socket.on("messageReceived", (data: { senderId: string,chatId: string,receiverId: string,targetType: string;}) => {
      try {
        const sender = Array.from(activeUsers).find(user => user.userId === data.senderId);
        if (sender) {
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