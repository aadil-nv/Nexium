import { IGetAllMeetingsDTO, IMeetingsDTO, IParticipantsDTO } from "../../dto/meetingDTO";


export default interface IMeetingService {
    getAllMeetings(myId: string): Promise<IGetAllMeetingsDTO[]>
    createMeeting(meeting: IMeetingsDTO, myId: string): Promise<IMeetingsDTO> 
    updateMeeting(meetingId: string, meeting: any): Promise<IMeetingsDTO>
    deleteMeeting(meetingId: string): Promise<IMeetingsDTO>
    getAllParticipants(myId: string): Promise<IParticipantsDTO[]>
}