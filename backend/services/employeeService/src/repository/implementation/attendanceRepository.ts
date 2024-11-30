import EmployeeAttendanceModel from "../../models/attendanceModel";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import IAttendanceRepository from "../../repository/interface/IAttendanceRepository";
import { Model } from "mongoose";
import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";

@injectable()
export default class AttendanceRepository extends BaseRepository<IEmployeeAttendance> implements IAttendanceRepository {


    constructor(@inject("IEmployeeAttendance") private readonly _employeeAttendanceModel: Model<IEmployeeAttendance>) {
        super(_employeeAttendanceModel);
      }

    // Fetch attendances for an employee
    async fetchAttendances(employeeId: string): Promise<any> {
        try {
            const attendances = await this._employeeAttendanceModel
                .find({ employeeId })
                .sort({ "attendance.date": -1 })
                .exec();
            return attendances;
        } catch (error) {
            console.error("Error fetching attendances:", error);
            return { error: "Internal server error" };
        }
    }

    // Find attendance by employee ID
    async findAttendanceByEmployeeId(employeeId: string): Promise<any> {
        console.log("hittin attendance repo=========================>>>>>>");
        
        try {
            return await this._employeeAttendanceModel.findOne({ employeeId });
        } catch (error) {
            console.error("Error finding attendance by employee ID:", error);
            return { error: "Internal server error" };
        }
    }

    // Create a new attendance record for an employee
     async createAttendanceRecord(employeeId: string): Promise<any> {
        console.log("create attendance repo=========================>>>>>>",employeeId);
        
        try {
            const newAttendance = new this._employeeAttendanceModel({ employeeId, attendance: [] });
            console.log("new attendance repo=========================>>>>>>",newAttendance);
            
            return await newAttendance.save();
        } catch (error) {
            console.error("Error creating attendance record:", error);
            return { error: "Internal server error" };
        }
    }

    // Update attendance for an employee
    async updateAttendance(id: string, updateData: any): Promise<any> {
        return await this._employeeAttendanceModel.findByIdAndUpdate(
            id,
            { $set: updateData }, // Use `$set` to update specific fields
            { new: true } // Return the updated document
        );
    }
}
