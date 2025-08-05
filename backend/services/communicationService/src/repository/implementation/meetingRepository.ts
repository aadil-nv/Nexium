import { inject, injectable } from "inversify";
import IMeetingRepository from "../../repository/interface/IMeetingRepository";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";
import { IMeeting } from "../../entities/meetingEntities";
import IEmployee from "../../entities/employeeEntities";
import { IManager } from "../../entities/managerEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IMeetingDetails } from "../../dto/meetingDTO";
import connectDB from "../../config/connectDB";


@injectable()
export default class MeetingRepository extends BaseRepository<IMeeting> implements IMeetingRepository {
    constructor(@inject("IMeeting")
    private _meetingModel: mongoose.Model<IMeeting>,
        @inject("IEmployee")
        private _employeeModel: mongoose.Model<IEmployee>,
        @inject("IManager")
        private _managerModel: mongoose.Model<IManager>,
        @inject("IBusinessOwnerDocument")
        private _businessOwnerModel: mongoose.Model<IBusinessOwnerDocument>,) {
        super(_meetingModel);

    }

    async getAllMeetings(myId: string, businessOwnerId: string): Promise<IMeetingDetails[]> {
        if (!mongoose.Types.ObjectId.isValid(myId)) {
            throw new Error("Invalid user ID provided");
        }

        const userObjectId = new mongoose.Types.ObjectId(myId);

        const pipeline = [
            {
                $match: {
                    participants: userObjectId,
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "participants",
                    foreignField: "_id",
                    as: "employeeDetails",
                },
            },
            {
                $lookup: {
                    from: "managers",
                    localField: "participants",
                    foreignField: "_id",
                    as: "managerDetails",
                },
            },
            {
                $lookup: {
                    from: "businessowners",
                    localField: "participants",
                    foreignField: "_id",
                    as: "businessOwnerDetails",
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "scheduledBy",
                    foreignField: "_id",
                    as: "scheduledByEmployee",
                },
            },
            {
                $lookup: {
                    from: "managers",
                    localField: "scheduledBy",
                    foreignField: "_id",
                    as: "scheduledByManager",
                },
            },
            {
                $lookup: {
                    from: "businessowners",
                    localField: "scheduledBy",
                    foreignField: "_id",
                    as: "scheduledByBusinessOwner",
                },
            },
            {
                $addFields: {
                    participantDetails: {
                        $map: {
                            input: "$participants",
                            as: "participantId",
                            in: {
                                $let: {
                                    vars: {
                                        employeeMatch: {
                                            $filter: {
                                                input: "$employeeDetails",
                                                cond: { $eq: ["$$this._id", "$$participantId"] }
                                            }
                                        },
                                        managerMatch: {
                                            $filter: {
                                                input: "$managerDetails",
                                                cond: { $eq: ["$$this._id", "$$participantId"] }
                                            }
                                        },
                                        businessOwnerMatch: {
                                            $filter: {
                                                input: "$businessOwnerDetails",
                                                cond: { $eq: ["$$this._id", "$$participantId"] }
                                            }
                                        }
                                    },
                                    in: {
                                        $cond: [
                                            { $gt: [{ $size: "$$employeeMatch" }, 0] },
                                            { $arrayElemAt: ["$$employeeMatch", 0] },
                                            {
                                                $cond: [
                                                    { $gt: [{ $size: "$$managerMatch" }, 0] },
                                                    { $arrayElemAt: ["$$managerMatch", 0] },
                                                    { $arrayElemAt: ["$$businessOwnerMatch", 0] }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    meetingTitle: 1,
                    meetingDate: 1,
                    meetingTime: 1,
                    meetingLink: 1,
                    participants: "$participantDetails",
                    isRecurring: 1,
                    recurringType: 1,
                    recurringDay: 1,
                    scheduledBy: {
                        $cond: [
                            { $gt: [{ $size: "$scheduledByEmployee" }, 0] },
                            { $arrayElemAt: ["$scheduledByEmployee", 0] },
                            {
                                $cond: [
                                    { $gt: [{ $size: "$scheduledByManager" }, 0] },
                                    { $arrayElemAt: ["$scheduledByManager", 0] },
                                    { $arrayElemAt: ["$scheduledByBusinessOwner", 0] }
                                ]
                            }
                        ]
                    },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ];

        try {
            const switchDB = await connectDB(businessOwnerId);

            const meetings = await switchDB.model("Meeting", this._meetingModel.schema).aggregate(pipeline).exec();
            return meetings;
        } catch (error: any) {
            console.error(`Failed to fetch meetings: ${error.message}`);
            throw new Error(`Failed to fetch meetings: ${error.message}`);
        }
    }

    async createMeeting(meeting: any, myId: string, businessOwnerId: string): Promise<IMeeting> {

        try {
            meeting.scheduledBy = myId;
            meeting.participants.push(myId);

            if (meeting.participants) {
                meeting.participants = meeting.participants.map((participant: any) =>
                    typeof participant === "string"
                        ? new mongoose.Types.ObjectId(participant)
                        : participant
                ) as any;
            }

            const switchDB = await connectDB(businessOwnerId);
            const createdMeeting = await switchDB.model("Meeting", this._meetingModel.schema).create(meeting);

            return createdMeeting as IMeeting;
        } catch (error: any) {
            console.error("Error creating meeting:", error.message);
            throw new Error("Failed to create meeting. Please try again later.");
        }
    }

    async updateMeeting(meetingId: string, meeting: any, businessOwnerId: string): Promise<IMeeting> {

        try {
            const switchDB = await connectDB(businessOwnerId);
            const updatedMeeting = await switchDB.model("Meeting", this._meetingModel.schema)
                .findByIdAndUpdate(meetingId, meeting)
                .exec();

            if (!updatedMeeting) {
                throw new Error(`Meeting with ID ${meetingId} not found.`);
            }

            return updatedMeeting as IMeeting;
        } catch (error: any) {
            console.error(`Error updating meeting: ${error.message}`);
            throw error;
        }
    }

    async deleteMeeting(meetingId: string, businessOwnerId: string): Promise<IMeeting> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const deletedMeeting = await switchDB.model("Meeting", this._meetingModel.schema).findByIdAndDelete(meetingId).exec();

            if (!deletedMeeting) {
                throw new Error(`Meeting with ID ${meetingId} not found.`);
            }

            return deletedMeeting as IMeeting;
        } catch (error: any) {
            console.error(`Error deleting meeting: ${error.message}`);
            throw error;
        }
    }
}


