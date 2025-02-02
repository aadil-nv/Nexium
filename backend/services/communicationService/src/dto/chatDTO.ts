import { IChat } from "entities/chatEntities";
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
     receiverPosition: any
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
    senderId: string;
    chatId: string;
    chatType: "private" | "group";
    receiverId: string;
    receiverName: string;
    receiverPosition: string;
    status: boolean;
    receiverProfilePicture?: string;
    lastMessage?: mongoose.Types.ObjectId ;
    createdAt?: Date;
    updatedAt?: Date;
    lastSeen?: Date;
}


export interface IParticipantDetails {
    _id: mongoose.Types.ObjectId;
    personalDetails?: {
        employeeName?: string;
        managerName?: string;
        businessOwnerName?: string;
        profilePicture?: string;
    };
    professionalDetails?: {
        position?: string;
    };
    role?: string;
    isActive?: boolean;
    lastSeen?: Date;
}

export interface IChatWithDetails extends IChat {
    participantDetails: IParticipantDetails;
}

export interface IMembersDTO{
    _id: string;
    name: string;
    profilePicture: string;
    position: string;
}


export interface IGroupMember {
    _id: string;
    name: string;
    role: string;
    position?: string; // Optional as businessOwners may not have it
    isActive: boolean;
}

export interface IGroupMemberDetails {
    employees: IGroupMember[];
    managers: IGroupMember[];
    businessOwners: IGroupMember[];
}

export interface IChatWithGroupDetails {
    _id: string;
    chatType: string;
    groupName: string;
    participants: string[]; // List of participant IDs
    groupAdmin: string;
    groupMemberDetails: IGroupMemberDetails;
    lastMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface IMembers {
    _id: string;
    name: string;
    profilePicture: string;
    position: string;
}

export interface IGroupDTO{
    _id: string;
    groupName: string;
    groupAdmin: string;
    participants: IMembers[];
    chatType: string;
}

export interface IParticipant {
    _id: string;
    personalDetails?: {
        employeeName?: string;
        managerName?: string;
        businessOwnerName?: string;
        profilePicture?: string;
    };
    professionalDetails?: {
        position?: string;
    };
    role?: string;
    isActive?: boolean;
}


export interface IUnAddedUsersDTO {
    _id: any;
    name: string;
    profilePicture?: string | undefined
    position: string;

}

export interface IResponseDTO{
    success?: boolean;
    message?: string;
    data?: any;
    subscription?: string;
    accessToken?:string;
  }