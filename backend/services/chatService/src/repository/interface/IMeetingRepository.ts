import { IMeeting } from "../../entities/meetingEntities";
import BaseRepository from "../../repository/implementation/baseRepository";



export default interface IMeetingRepository extends BaseRepository<IMeeting> {
    getAllMeetings(myId: string): Promise<IMeeting[]>
}