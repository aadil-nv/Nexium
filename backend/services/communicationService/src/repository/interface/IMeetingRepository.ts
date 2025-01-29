import { IMeetingDetails } from "dto/meetingDTO";
import { IMeeting } from "../../entities/meetingEntities";
import BaseRepository from "../../repository/implementation/baseRepository";



export default interface IMeetingRepository extends BaseRepository<IMeeting> {
    getAllMeetings(myId: string): Promise<IMeetingDetails[]>
    createMeeting(meeting: IMeeting , myId: string): Promise<IMeeting>
    updateMeeting(meetingId: string, meeting: any): Promise<IMeeting>
    deleteMeeting(meetingId: string): Promise<IMeeting>
}