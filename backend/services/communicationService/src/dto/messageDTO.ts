
import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IMessageDTO {
    text?: string;
    senderId?: string;
    chatId?: string;
    attachments?: string;
    readBy?: string;
    createdAt?: string;
    reciverId?: string;
    status?: string;
    senderName?: string;
    senderPicture?: string;
    success?: boolean;
    messageId?: string;
}


export interface ISenderDetails {
    businessOwnerName?: string;
    employeeName?: string;
    managerName?: string;
    profilePicture?: string;
    email?: string;
    phone?: string;
}

export interface IMessageResponse {
    success: boolean;
    message: string;
}


