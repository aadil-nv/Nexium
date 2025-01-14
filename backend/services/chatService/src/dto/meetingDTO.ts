

export interface IMeetingsDTO {
      _id: any; // Unique identifier for the meeting
      meetingTitle: string; // Title of the meeting
      meetingDate: Date; // Date of the meeting
      meetingTime: string; // Time of the meeting
      startingTime: string; // Starting time of the meeting
      endingTime: string; // Ending time of the meeting
      participants: string[]; // List of participant IDs
      meetingLink: string; // Link to join the meeting
      scheduledBy: string; // ID of the user who scheduled the meeting
  }
  