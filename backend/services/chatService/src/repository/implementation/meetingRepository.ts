import { inject , injectable } from "inversify";
import  IMeetingRepository  from "../../repository/interface/IMeetingRepository";
import { IMeetingsDTO } from "../../dto/meetingDTO";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";
import { IMeeting } from "../../entities/meetingEntities";


@injectable()
export default class MeetingRepository extends BaseRepository<IMeeting> implements IMeetingRepository {
    constructor(@inject("IMeeting")private _meetingModel: mongoose.Model<IMeeting>) {
        super(_meetingModel);
        
    }

    async getAllMeetings(myId: string): Promise<IMeeting[]> {
        try {
            const meetings = await this._meetingModel.find({ participants: { $in: [myId] } }).exec();
            return meetings;
        } catch (error) {
            throw error;
        }
    }
}


