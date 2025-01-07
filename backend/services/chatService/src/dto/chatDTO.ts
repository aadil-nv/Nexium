import mongoose from "mongoose";
import { ObjectId } from "mongoose";


export interface IChatResponseDTO {
    message?: string;
    sender?: string;
    receiver?: string;
    success?: boolean;
};

export interface IReceiverDTO {
    senderId: any;
     receiverId: any;
     receiverName: string;
     reciverPosition: any
     status: boolean | undefined;
     receiverProfilePicture: string | undefined
     lastSeen?: Date;

}



export interface ISetNewAccessTokenDTO {
    accessToken: string;
    message: string;
    success: boolean
    businessOwnerId?:string
    managerId?:string
    employeeId?:string
}


export interface IGetAllGroupsDTO {
    senderId: any;
    groupId?: any;
    groupName: string;
    groupAdmin: string;
    participants: string[];
    chatType: 'private' | 'group';
}


export interface ICreateGroupDTO {
    chatId?: any; // Use ObjectId
    groupName: string;
    participants: ObjectId[]; // Use ObjectId[] instead of string[]
    chatType: 'private' | 'group';
    groupAdmin: any; // Use ObjectId
    success: boolean;
}

export interface IPrivateChatDTO {
  chatId: any;
  chatType: 'private' | 'group';
  reciverId: string;
  reciverName: string;
  reciverPosition: string;
  status: boolean | undefined;
  receiverProfilePicture: string | undefined

}