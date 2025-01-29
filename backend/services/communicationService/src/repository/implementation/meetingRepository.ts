import { inject , injectable } from "inversify";
import  IMeetingRepository  from "../../repository/interface/IMeetingRepository";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";
import { IMeeting } from "../../entities/meetingEntities";
import { log } from "console";
import IEmployee from "../../entities/employeeEntities";
import { IManager } from "../../entities/managerEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IMeetingDetails } from "../../dto/meetingDTO";


@injectable()
export default class MeetingRepository extends BaseRepository<IMeeting> implements IMeetingRepository {
    constructor(@inject("IMeeting")
    private _meetingModel: mongoose.Model<IMeeting> ,
     @inject("IEmployee")
         private _employeeModel: mongoose.Model<IEmployee>,
        @inject("IManager")
        private _managerModel: mongoose.Model<IManager>,
        @inject("IBusinessOwnerDocument") 
        private _businessOwnerModel: mongoose.Model<IBusinessOwnerDocument>,) {
        super(_meetingModel);
        
    }

    async getAllMeetings(myId: string): Promise<IMeetingDetails[]> {
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
            const meetings = await this._meetingModel.aggregate(pipeline).exec();
            return meetings;
        } catch (error: any) {
            console.error(`Failed to fetch meetings: ${error.message}`);
            throw new Error(`Failed to fetch meetings: ${error.message}`);
        }
    }
    
    

    async createMeeting(meeting: any, myId: string): Promise<IMeeting> {
        try {
            // Set the scheduledBy field to the current user's ID
            meeting.scheduledBy = myId;
            meeting.participants.push(myId);
    
            // Ensure participants are properly cast to ObjectId
            if (meeting.participants) {
                meeting.participants = meeting.participants.map((participant: any) =>
                    typeof participant === "string"
                        ? new mongoose.Types.ObjectId(participant)
                        : participant
                ) as any;
            }
    
            // Create the meeting document in the database
            const createdMeeting = await this._meetingModel.create(meeting);
    
            // Ensure the result is returned with the correct type
            return createdMeeting as IMeeting;
        } catch (error: any) {
            console.error("Error creating meeting:", error.message);
            throw new Error("Failed to create meeting. Please try again later.");
        }
    }
    
    
    

    async updateMeeting(meetingId: string, meeting: any): Promise<IMeeting > {

        console.log("Updating meeting with ID:", meetingId);
        console.log("Meeting data:", meeting);
        
        
        try {
          const updatedMeeting = await this._meetingModel
            .findByIdAndUpdate(meetingId, meeting)
            .exec();
    
          if (!updatedMeeting) {
            throw new Error(`Meeting with ID ${meetingId} not found.`);
          }
    
          return updatedMeeting as IMeeting; // Explicit cast to IMeeting
        } catch (error:any) {
          console.error(`Error updating meeting: ${error.message}`);
          throw error;
        }
      }

      async deleteMeeting(meetingId: string): Promise<IMeeting> {
        try {
          const deletedMeeting = await this._meetingModel.findByIdAndDelete(meetingId).exec();
    
          if (!deletedMeeting) {
            throw new Error(`Meeting with ID ${meetingId} not found.`);
          }
    
          return deletedMeeting as IMeeting; // Explicit cast to IMeeting
        } catch (error:any) {
          console.error(`Error deleting meeting: ${error.message}`);
          throw error;
        }
      }
}


