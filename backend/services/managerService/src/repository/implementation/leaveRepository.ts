import { injectable, inject } from "inversify";
import ILeaveRepository from "../interface/ILeaveRepository";
import mongoose, { Model } from "mongoose";
import employeeAttendanceModel from "../../models/attendanceModel";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "./baseRepository";
import employeeModel from '../../models/employeeModel';
import leaveTypeModel from "../../models/leaveTypeModel";
import { ILeaveType} from "../../entities/leaveTypeEntities";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";
import employeeLeaveModel from "../../models/employeeLeaveModel";

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
    
    
    async findAllLeaveTypes(): Promise<ILeaveType> {
        try {
            // Use Mongoose's `findOne()` to retrieve the first leave types document
            let leaveTypesDoc = await leaveTypeModel.findOne();
    
            if (!leaveTypesDoc) {
                // If no document exists, create a new one with default leave type values set to 0
                const newLeaveTypesDoc = await leaveTypeModel.create({
                    sickLeave: 0,        // Default max days for Sick Leave
                    casualLeave: 0,      // Default max days for Casual Leave
                    maternityLeave: 0,   // Default max days for Maternity Leave
                    paternityLeave: 0,   // Default max days for Paternity Leave
                    paidLeave: 0,        // Default max days for Paid Leave
                    unpaidLeave: 0,      // Default max days for Unpaid Leave
                    compensatoryLeave: 0, // Default max days for Compensatory Leave
                    bereavementLeave: 0,  // Default max days for Bereavement Leave
                    marriageLeave: 0,     // Default max days for Marriage Leave
                    studyLeave: 0,        // Default max days for Study Leave
                });
    
                // Return the newly created document
                return newLeaveTypesDoc;
            }
    
            // If a document exists, return it
            return leaveTypesDoc;
        } catch (error) {
            console.error("Error in findAllLeaveTypes repository:", error);
            throw new Error("Failed to fetch leave types");
        }
    }
    
    
    

    async updateLeaveTypes(leaveTypeId: string, data: Partial<ILeaveType>): Promise<ILeaveType> {
        try {
            // Find the leave types document by ID
            const leaveTypesDoc = await leaveTypeModel.findOne();
    
            if (!leaveTypesDoc) {
                throw new Error('Leave types document not found');
            }
    
            // Update the corresponding leave type field with new data
            if (data.sickLeave !== undefined) leaveTypesDoc.sickLeave = data.sickLeave;
            if (data.casualLeave !== undefined) leaveTypesDoc.casualLeave = data.casualLeave;
            if (data.maternityLeave !== undefined) leaveTypesDoc.maternityLeave = data.maternityLeave;
            if (data.paternityLeave !== undefined) leaveTypesDoc.paternityLeave = data.paternityLeave;
            if (data.paidLeave !== undefined) leaveTypesDoc.paidLeave = data.paidLeave;
            if (data.unpaidLeave !== undefined) leaveTypesDoc.unpaidLeave = data.unpaidLeave;
            if (data.compensatoryLeave !== undefined) leaveTypesDoc.compensatoryLeave = data.compensatoryLeave;
            if (data.bereavementLeave !== undefined) leaveTypesDoc.bereavementLeave = data.bereavementLeave;
            if (data.marriageLeave !== undefined) leaveTypesDoc.marriageLeave = data.marriageLeave;
            if (data.studyLeave !== undefined) leaveTypesDoc.studyLeave = data.studyLeave;
    
            // Save the updated document
            const updatedResult = await leaveTypesDoc.save();
    
            // Return the updated leave type document
            return updatedResult;
        } catch (error: any) {
            console.error("Error in updateLeaveTypes repository:", error);
            throw new Error("Failed to update leave types");
        }
    }
    
    async getEmployeeLeaves(employeeId: string): Promise<IEmployeeLeave> {
        try {
            // Use Mongoose's `findOne()` to retrieve the leave employee document
            const leaveEmployeeDoc = await employeeLeaveModel.findOne({ employeeId });
    
            if (!leaveEmployeeDoc) {
                throw new Error('Leave employee document not found');
            }
    
            // Return the leave employee document
            return leaveEmployeeDoc;
        } catch (error) {
            console.error("Error in getEmployeeLeaves repository:", error);
            throw new Error("Failed to fetch leave employee");
        }
    }
    
    
    

}
