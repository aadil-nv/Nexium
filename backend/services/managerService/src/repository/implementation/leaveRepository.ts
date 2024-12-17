import { injectable, inject } from "inversify";
import ILeaveRepository from "../interface/ILeaveRepository";
import { Model } from "mongoose";
import employeeAttendanceModel from "../../models/attendanceModel";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "./baseRepository";
import employeeModel from '../../models/employeeModel';
import { log } from "console";

@injectable()
export default class LeaveRepository extends BaseRepository<IEmployeeAttendance> implements ILeaveRepository {

    constructor(@inject("IEmployeeAttendance") private employeeAttendanceModel: Model<IEmployeeAttendance>) {
        super(employeeAttendanceModel);
    }
    async updateLeaveApproval(employeeId: string, data: any): Promise<IEmployeeAttendance | null> {
        console.log('"hitting updateLeaveApproval repository=------------------"'.bgRed);
        console.log(`employeeId is ${employeeId}`.bgGreen);
        console.log(`data is `.bgGreen,data);
        
        
        
        try {
            // Format the provided date to "YYYY-MM-DD"
            const formattedDate = new Date(data.date).toISOString().split('T')[0];

            console.log(`form atted date is `.bgBlue, formattedDate);
            
    
            // Fetch the employee's attendance data
            const employeeAttendance = await this.employeeAttendanceModel.findOne({ employeeId });
            if (!employeeAttendance) {
                throw new Error("Employee attendance not found");
            }
    
            // Find the specific attendance entry based on the formatted date
            const attendanceEntry = employeeAttendance.attendance.find(entry => entry.date === formattedDate);
            if (!attendanceEntry) {
                throw new Error("Attendance entry for the specified date not found");
            }
    
            const leaveField = data.leaveType; // Type of leave (e.g., "sick", "vacation")
    
            console.log(`"attendanceEntry.leaveStatus is ${attendanceEntry}`.bgYellow);
            
            
            if (attendanceEntry.leaveStatus === "Pending" || attendanceEntry.status === "Absent") {
                console.log(`"attendanceEntry.leaveStatus is ${attendanceEntry.leaveStatus}`.bgYellow);
                if (data.action === "Approved") {
                    attendanceEntry.leaveStatus = "Approved";
              
                    await employeeModel.findOneAndUpdate(
                        { _id: employeeId },
                        { $inc: { [`leaves.${leaveField}`]: -1 } }
                    );
                } else if(data.action == "Rejected") {
                    console.log(`"######################################"`.bgCyan);
                    
                    attendanceEntry.leaveStatus = "Rejected";
                    attendanceEntry.rejectionReason = data.reason;
                }
            } else if (attendanceEntry.leaveStatus === "Rejected" && data.action === "Approved") {
                attendanceEntry.leaveStatus = "Approved";
                // Decrement the leave count for the specified leave type
                await employeeModel.findOneAndUpdate(
                    { _id: employeeId },
                    { $inc: { [`leaves.${leaveField}`]: -1 } }
                );
            } else if (attendanceEntry.leaveStatus === "Approved" && data.action === "Rejected") {
                attendanceEntry.leaveStatus = "Rejected";
                attendanceEntry.rejectionReason = data.reason;
                // Increment the leave count for the specified leave type
                await employeeModel.findOneAndUpdate(
                    { _id: employeeId },
                    { $inc: { [`leaves.${leaveField}`]: 1 } }
                );
            }
    
            // Save the updated attendance
           const result =  await employeeAttendance.save();
            console.log(`Updated leave approval for employee ${result}`.bgRed);
            
    
            return result;
        } catch (error) {
            console.error("Error in updateLeaveApproval repository:", error);
            throw new Error("Failed to update leave approval");
        }
    }
    
    
    async getAllLeaveEmployees(): Promise<any> {
        try {
            const results = await this.employeeAttendanceModel.find({
                "attendance.leaveStatus": { 
                    $in: ["Pending", "Approved", "Rejected"],
                    $exists: true // Ensure the field exists and is not undefined
                }
            });
    
            // Filter out attendance records where leaveStatus is null or undefined
            const filteredResults = results.map(employee => {
                // Filter attendance where leaveStatus is not null or undefined
                const filteredAttendance = employee.attendance.filter(attendance => 
                    attendance.leaveStatus !== null && attendance.leaveStatus !== undefined  && attendance.leaveStatus !== "null"
                );
                
                // Return employee data with filtered attendance
                return { ...employee.toObject(), attendance: filteredAttendance };
            });
    
            if (!filteredResults || filteredResults.length === 0) {
                throw new Error("No leave employees found with valid leave status");
            }
    
            console.log("========================================================");
            console.log();
            console.log();
            console.log();
            console.log(`Total leave employees: ${filteredResults.length}`.bgMagenta);
            console.log();
            console.log();
            console.log();
            console.log("========================================================");
            return filteredResults;
        } catch (error) {
            console.error("Error in getAllLeaveEmployees repository:", error);
            throw new Error("Failed to fetch leave employees");
        }
    }
    
    
    
    
}
