import mongoose from "mongoose";


export interface IMeetingsDTO {
      _id: any; // Unique identifier for the meeting
      meetingTitle: string; // Title of the meeting
      meetingDate: Date; // Date of the meeting
      meetingTime: string; // Time of the meeting
      participants: string[]; // List of participant IDs
      meetingLink: string; // Link to join the meeting
      scheduledBy: string; // ID of the user who scheduled the meeting
  }
  export interface IParticipantsDTO {
     userId: any;
     userName: string;
     userPosition: any
     profilePicture: string | undefined

}

export interface IGetAllMeetingsDTO {
    _id: string; // Unique identifier for the meeting
    meetingTitle: string; // Title of the meeting
    meetingDate: Date; // Date of the meeting
    meetingTime: string; // Time of the meeting
    participants: IParticipantDTO[]; // List of participant details
    meetingLink: string; // Link to join the meeting
    scheduledBy: IScheduledByDTO; // Details of the user who scheduled the meeting
    createdAt: Date; // Timestamp when the meeting was created
    updatedAt: Date; // Timestamp when the meeting was last updated
}

export interface IParticipantDTO {
    userId: string; // Unique identifier for the participant
    userName: string; // Name of the participant
    userPosition: string; // Position of the participant
    profilePicture?: string; // Profile picture of the participant (optional)
}

export interface IScheduledByDTO {
    userId: string; // Unique identifier for the scheduler
    userName: string; // Name of the scheduler
    userPosition: string; // Position of the scheduler
    profilePicture?: string; // Profile picture of the scheduler (optional)
}



// export interface IParticipantDetails {
//     _id: mongoose.Types.ObjectId;
//     personalDetails?: {
//         employeeName?: string;
//         managerName?: string;
//         businessOwnerName?: string;
//         profilePicture?: string;
//     };
//     professionalDetails?: {
//         position?: string;
//     };
//     role?: string;
//     isActive?: boolean;
// }

// export interface IMeetDetailes extends IMeet {
//     participantDetails: IParticipantDetails;
// }



export interface IPersonalDetails {
    employeeName?: string;
    managerName?: string;
    businessOwnerName?: string;
    profilePicture?: string;
}

export interface IProfessionalDetails {
    position?: string;
    department?: string;
}

export interface IParticipantDetails {
    _id: mongoose.Types.ObjectId;
    personalDetails?: IPersonalDetails;
    professionalDetails?: IProfessionalDetails;
    role?: string;
    isActive?: boolean;
}

export interface IScheduledByDetails {
    _id: mongoose.Types.ObjectId;
    personalDetails?: IPersonalDetails;
    professionalDetails?: IProfessionalDetails;
    role?: string;
    isActive?: boolean;
}

export interface IMeetingDetails {
    _id: mongoose.Types.ObjectId;
    meetingTitle: string;
    meetingDate: Date;
    meetingTime: string;
    meetingLink: string;
    participants: IParticipantDetails[];
    scheduledBy: IScheduledByDetails;
    createdAt: Date;
    updatedAt: Date;
}
