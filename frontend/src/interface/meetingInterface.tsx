import  { Dayjs } from "dayjs";
export interface Participant {
    userId: string;
    userName: string;
    userPosition: string;
    profilePicture: string;
  }
  
  export interface Meeting {
    _id: string;
    meetingTitle: string;
    meetingDate: string;
    meetingTime: string;
    participants: Participant[];
    meetingLink: string;
    scheduledBy: ScheduledBy;
  }
  
  export interface ScheduledBy {
    userId: string;
    userName: string;
    userPosition: string;
    profilePicture: string;
  }
  
  export interface FormValues {
    meetingTitle: string;
    meetingDate: Dayjs;
    meetingTime: Dayjs;
    participants: string[];
    scheduledBy: ScheduledBy;
  }