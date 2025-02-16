import { injectable, inject } from "inversify";
import mongoose, { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import { IAppliedLeave } from "../../entities/appliedLeaveEntities";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import employeeLeaveModel from "../../models/employeeLeaveModel";
import connectDB from "../../config/connectDB";
import {IEmployeeLeave} from "../../entities/employeeLeaveEntities";

@injectable()
export default class LeaveRepository extends BaseRepository<IAppliedLeave> implements ILeaveRepository {
    constructor(@inject("IAppliedLeave") 
    private appliedLeaveModel: Model<IAppliedLeave>) {
        super(appliedLeaveModel);
    }

    async applyLeave(employeeId: string, leaveData: any, businessOwnerId: string): Promise<IAppliedLeave> {
       
    
        try {
            if (!employeeId || !businessOwnerId) {
                throw new Error("Employee ID and Business Owner ID are required");
            }
    
            const switchDB = await connectDB(businessOwnerId);
            const employeeLeave = await switchDB.model<IEmployeeLeave>('EmployeeLeave', employeeLeaveModel.schema)
                .findOne({ employeeId });
    
            if (!employeeLeave) {
                throw new Error("Employee not found");
            }
    
            const { leaveType, fromDate, toDate, duration, reason, isFirstHalf, isSecondHalf } = leaveData;
    
            if (!leaveType || !fromDate || !toDate || duration == undefined || !reason) {
                throw new Error("Missing required fields: leaveType, fromDate, toDate, duration, or reason");
            }
    
            const AppliedLeaveModel = switchDB.model<IAppliedLeave>("AppliedLeave", this.appliedLeaveModel.schema);
    
            // **Check if leave is already applied for the given date range**
            const existingLeave = await AppliedLeaveModel.findOne({
                employeeId,
                $or: [
                    { startDate: { $lte: new Date(toDate) }, endDate: { $gte: new Date(fromDate) } }
                ]
            });
    
            if (existingLeave) {
                throw new Error("Leave for the selected date range has already been applied");
            }
    
            const leave = new AppliedLeaveModel({
                employeeId,
                leaveType,
                reason,
                startDate: new Date(fromDate),
                endDate: new Date(toDate),
                duration,
                daysCount: duration,
                status: 'pending',
                appliedAt: new Date(),
                isFirstHalf,
                isSecondHalf
            });
    
            return await leave.save();
        } catch (error: any) {
            console.error("Error applying leave:", error.message || error);
            throw new Error(error.message || "Failed to apply leave");
        }
    }

    async fetchAppliedLeaves(employeeId: string ,businessOwnerId: string): Promise<IAppliedLeave[]> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const leaveData: IAppliedLeave[] = await switchDB.model<IAppliedLeave>("AppliedLeave", this.appliedLeaveModel.schema).find({ employeeId });

            return leaveData;
        } catch (error) {
            console.error("Error fetching applied leaves:", error);
            throw new Error("Error fetching applied leaves");
        }
    }

    async updateAppliedLeave(employeeId: string, leaveId: string, leaveData: any, businessOwnerId: string): Promise<IAppliedLeave> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const AppliedLeaveModel = switchDB.model<IAppliedLeave>("AppliedLeave", this.appliedLeaveModel.schema);
    
            const leave = await AppliedLeaveModel.findById(leaveId);
            if (!leave) {
                throw new Error("Leave not found");
            }
    
            const { fromDate, toDate } = leaveData;
    
            if (fromDate && toDate) {
                // **Check if updated leave dates overlap with existing leaves**
                const existingLeave = await AppliedLeaveModel.findOne({
                    employeeId,
                    _id: { $ne: leaveId }, // Exclude the current leave being updated
                    $or: [
                        { startDate: { $lte: new Date(toDate) }, endDate: { $gte: new Date(fromDate) } }
                    ]
                });
    
                if (existingLeave) {
                    throw new Error("Updated leave dates conflict with an already applied leave");
                }
            }
    
            leave.set(leaveData);
            leave.status = 'pending';
            const updatedLeave = await leave.save();
    
            return updatedLeave;
        } catch (error: any) {
            console.error("Error updating applied leave:", error.message || error);
            throw new Error(error.message || "Error updating applied leave");
        }
    }

    async deleteAppliedLeave(employeeId: string, leaveId: string , businessOwnerId: string): Promise<IAppliedLeave | null> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const deletedLeave = await switchDB.model<IAppliedLeave>("AppliedLeave", this.appliedLeaveModel.schema).findOneAndDelete({_id:leaveId});
            return deletedLeave;
        } catch (error:any) {
            console.error("Error deleting applied leave:", error.message || error);
            throw new Error("Error deleting applied leave");
        }
    }
    
    async approvedLasmonthLeaves(employeeId: string ,businessOwnerId: string): Promise<any> {
        try {
            const lastMonthStart = new Date();
            lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
            lastMonthStart.setDate(1);  // Start of the last month
    
            const lastMonthEnd = new Date();
            lastMonthEnd.setDate(0);  
            const switchDB = await connectDB(businessOwnerId);
            const appliedLeaves = await switchDB.model<IAppliedLeave>("AppliedLeave", this.appliedLeaveModel.schema).aggregate([
                {
                    $match: {
                        employeeId: new mongoose.Types.ObjectId(employeeId),
                        status: 'approved',  
                        startDate: { $gte: lastMonthStart, $lte: lastMonthEnd }, 
                    },
                },
                {
                    $group: {
                        _id: '$leaveType', 
                        totalDuration: { $sum: '$duration' },  
                    },
                },
                {
                    $project: {
                        leaveType: '$_id',  
                        totalDuration: 1,
                        _id: 0,  
                    },
                },
            ]);
    
            return appliedLeaves;
        } catch (error) {
            console.error('Error fetching approved leaves for last month:', error);
            throw error;
        }
    }


    async getEmployeeLeaves(employeeId: string, businessOwnerId: string): Promise<IEmployeeLeave | null> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const employeeLeave = await switchDB.model<IEmployeeLeave>('EmployeeLeave', employeeLeaveModel.schema)
            const leave = await employeeLeave.findOne({ employeeId });
    
            return leave; // Returning the found document
        } catch (error) {
            console.error('Error fetching employee leaves:', error);
            throw error;
        }
    }
    
    
    
}
