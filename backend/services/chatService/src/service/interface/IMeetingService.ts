import { IMeetingsDTO } from "../../dto/meetingDTO";


export default interface IMeetingService {
    getAllMeetings(myId: string): Promise<IMeetingsDTO[]>
}