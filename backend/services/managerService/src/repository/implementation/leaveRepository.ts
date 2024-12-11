import { injectable, inject } from "inversify";
import ILeaveRepository from "../interface/ILeaveRepository";
import { Model } from "mongoose";
import employeeAttendanceModel from "../../models/attendanceModel";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "./baseRepository";

@injectable()
export default class LeaveRepository extends BaseRepository<IEmployeeAttendance> implements ILeaveRepository {

    constructor(@inject("IEmployeeAttendance") private employeeAttendanceModel: Model<IEmployeeAttendance>) {
        super(employeeAttendanceModel);
    }

    async updateLeaveApproval(employeeId: string, leaveId: string, leaveStatus: string): Promise<IEmployeeAttendance | null> {
        try {
            const result = await this.employeeAttendanceModel.findOneAndUpdate(
                { _id: employeeId, "leaves._id": leaveId },
                { $set: { "leaves.$.status": leaveStatus } },
                { new: true }
            );
            return result;
        } catch (error) {
            console.error("Error in updateLeaveApproval repository:", error);
            throw new Error("Failed to update leave approval");
        }
    }

    async getAllLeaveEmployees(): Promise<any> {
        try {
            const results = await this.employeeAttendanceModel.find({
                "attendance.leaveStatus": { $in: ["Pending", "Approved", "Rejected"] }
            });
            if (!results || results.length === 0) {
                throw new Error("No leave employees found with valid leave status");
            }
            return results;
        } catch (error) {
            console.error("Error in getAllLeaveEmployees repository:", error);
            throw new Error("Failed to fetch leave employees");
        }
    }
    
    
    
}
