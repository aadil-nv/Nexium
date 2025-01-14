import { inject, injectable } from "inversify";
import IMeetingService from "../interface/IMeetingService";
import IMeetingRepository from "../../repository/interface/IMeetingRepository";
import { IMeetingsDTO } from "../../dto/meetingDTO";
import { IMeeting } from "../../entities/meetingEntities";

@injectable()
export default class MeetingService implements IMeetingService {
  constructor(@inject("IMeetingRepository") private _meetingRepository: IMeetingRepository) {}

  async getAllMeetings(myId: string): Promise<IMeetingsDTO[]> {  // Corrected return type to an array of IMeetingsDTO
    try {
      const meetings: IMeeting[] = await this._meetingRepository.getAllMeetings(myId);

      // Map database model data to the IMeetingsDTO format
      const meetingDTO: IMeetingsDTO[] = meetings.map((meeting: IMeeting) => ({
        _id: meeting._id, // Convert _id to string to match IMeetingDTO
        meetingTitle: meeting.meetingTitle,
        meetingDate: meeting.meetingDate,
        meetingTime: meeting.meetingTime,
        startingTime: meeting.startingTime,
        endingTime: meeting.endingTime,
        participants: meeting.participants.map(participant => participant.toString()), // Ensure participants are strings
        meetingLink: meeting.meetingLink,
        scheduledBy: meeting.scheduledBy.toString(), // Ensure scheduledBy is a string
      }));

      return meetingDTO; // Return the mapped DTO as an array of IMeetingsDTO
    } catch (error: any) {
      console.log("Error getting all meetings:", error.message);
      throw error;
    }
  }
}

