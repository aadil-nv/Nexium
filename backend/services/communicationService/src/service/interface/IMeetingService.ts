import { IGetAllMeetingsDTO, IMeetingsDTO, IParticipantsDTO } from "../../dto/meetingDTO";


export default interface IMeetingService {
    getAllMeetings(myId: string ,businessOwnerId: string): Promise<IGetAllMeetingsDTO[]>
    createMeeting(meeting: IMeetingsDTO, myId: string ,businessOwnerId: string): Promise<IMeetingsDTO> 
    updateMeeting(meetingId: string, meeting: any,businessOwnerId: string): Promise<IMeetingsDTO>
    deleteMeeting(meetingId: string ,businessOwnerId: string): Promise<IMeetingsDTO>
    getAllParticipants(myId: string , businessOwnerId: string): Promise<IParticipantsDTO[]>
}