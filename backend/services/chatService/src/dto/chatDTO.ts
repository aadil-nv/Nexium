export interface IChatResponseDTO {
    message?: string;
    sender?: string;
    receiver?: string;
    success?: boolean;
};

export interface IReceiverDTO {
     receiverId: any;
     receiverName: string;
     status: boolean;
     receiverProfilePicture: string;
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