import { IMeetingDetails } from "dto/meetingDTO";
import { IMeeting } from "../../entities/meetingEntities";
import BaseRepository from "../../repository/implementation/baseRepository";



export default interface IMeetingRepository extends BaseRepository<IMeeting> {
    getAllMeetings(myId: string, businessOwnerId: string): Promise<IMeetingDetails[]>
    createMeeting(meeting: IMeeting , myId: string, businessOwnerId: string): Promise<IMeeting>
    updateMeeting(meetingId: string, meeting: any , businessOwnerId: string): Promise<IMeeting>
    deleteMeeting(meetingId: string , businessOwnerId: string): Promise<IMeeting>
}