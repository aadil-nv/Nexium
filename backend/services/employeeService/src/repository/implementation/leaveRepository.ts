import { injectable, inject } from "inversify";
import mongoose, { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import { IAppliedLeave } from "../../entities/appliedLeaveEntities";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import employeeLeaveModel from "../../models/employeeLeaveModel";

@injectable()
export default class LeaveRepository extends BaseRepository<IAppliedLeave> implements ILeaveRepository {
    constructor(@inject("IAppliedLeave") 
    private appliedLeaveModel: Model<IAppliedLeave>) {
        super(appliedLeaveModel);
    }

    async applyLeave(employeeId: string, leaveData: any): Promise<IAppliedLeave> {
        console.log("Applying leave for employee:", employeeId);
        console.log("Leave data:", leaveData);

        try {
            // Find employee leave data
            const employeeLeave = await employeeLeaveModel.findOne({ employeeId });
            
            // Ensure employee leave data exists
            if (!employeeLeave) {
                throw new Error("Employee not found");
            }


            // Extract leave types, dates, and other data from leaveData
            const { leaveType, fromDate, toDate, duration, reason } = leaveData;

            // Check if required fields are provided
            if (!fromDate || !toDate || duration == undefined || !reason) {
                throw new Error("Missing required fields: fromDate, toDate, duration, or reason");
            }

        

            // Prepare the leave object to save
            const leave = new this.appliedLeaveModel({
                employeeId,
                leaveType:leaveData.leaveType,  // Store all leave types provided
                reason,
                startDate: new Date(fromDate),
                endDate: new Date(toDate),
                duration,
                daysCount: duration,  // Total days applied
                status: 'pending',    // Initial status
                appliedAt: new Date(),  // Current date
            });

            // Save the leave record and return the result
            return await leave.save();
            
        } catch (error) {
            console.error("Error applying leave:", error);
            throw error;
        }
    }

    async fetchAppliedLeaves(employeeId: string): Promise<IAppliedLeave[]> {
        try {
            // Fetch all leave records for the given employeeId
            const leaveData: IAppliedLeave[] = await this.appliedLeaveModel.find({ employeeId });

            return leaveData;
        } catch (error) {
            console.error("Error fetching applied leaves:", error);
            throw new Error("Error fetching applied leaves");
        }
    }

    async updateAppliedLeave(employeeId: string, leaveId: string, leaveData: any): Promise<IAppliedLeave> {
        try {
            // Find the leave document by leaveId
            const leave = await this.appliedLeaveModel.findById(leaveId);
    
            if (!leave) {
                throw new Error("Leave not found");
            }
    
            // Update the fields using the set method
            leave.set(leaveData);
    
            // Ensure the status is always set to 'pending'
            leave.status = 'pending';
    
            // Save the updated leave
            const updatedLeave = await leave.save();
    
            return updatedLeave;
        } catch (error) {
            console.error("Error updating applied leave:", error);
            throw new Error("Error updating applied leave");
        }
    }

    async deleteAppliedLeave(employeeId: string, leaveId: string): Promise<IAppliedLeave | null> {
        try {
            console.log("Deleting applied leave with ID:", leaveId);
            console.log("Employee ID:", employeeId);
            
            const deletedLeave = await this.appliedLeaveModel.findOneAndDelete({_id:leaveId});
    
            return deletedLeave;
        } catch (error:any) {
            console.error("Error deleting applied leave:", error.message || error);
            throw new Error("Error deleting applied leave");
        }
    }
    
    async approvedLasmonthLeaves(employeeId: string): Promise<any> {
        try {
            const lastMonthStart = new Date();
            lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
            lastMonthStart.setDate(1);  // Start of the last month
    
            const lastMonthEnd = new Date();
            lastMonthEnd.setDate(0);  // End of the last month (the last day of the previous month)
    
            const appliedLeaves = await this.appliedLeaveModel.aggregate([
                {
                    $match: {
                        employeeId: new mongoose.Types.ObjectId(employeeId),
                        status: 'approved',  // Only approved leaves
                        startDate: { $gte: lastMonthStart, $lte: lastMonthEnd },  // Leaves within the last month
                    },
                },
                {
                    $group: {
                        _id: '$leaveType',  // Group by leave type
                        totalDuration: { $sum: '$duration' },  // Sum the duration field (days count)
                    },
                },
                {
                    $project: {
                        leaveType: '$_id',  // Rename _id to leaveType
                        totalDuration: 1,  // Include the total duration
                        _id: 0,  // Exclude the _id field
                    },
                },
            ]);
    
           
    
            return appliedLeaves;
        } catch (error) {
            console.error('Error fetching approved leaves for last month:', error);
            throw error;
        }
    }
    
    
}
