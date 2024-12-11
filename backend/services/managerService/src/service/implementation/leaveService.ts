import { injectable,inject } from "inversify";
import ILeaveService from "../interface/ILeaveService";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import {ILeaveResonseDTO ,ILeaveDTO} from "../../dto/ILeaveDTO";



@injectable()
export default class LeaveService implements ILeaveService {
    constructor(@inject("ILeaveRepository") private _leaveRepository: ILeaveRepository) {}

    async updateLeaveApproval(employeeId: string, leaveId: string, leaveStatus: string): Promise<ILeaveResonseDTO> {
        try {
            const result = await this._leaveRepository.updateLeaveApproval(employeeId, leaveId, leaveStatus);
            return {
                leaveStatus: result?.attendance[0].leaveStatus,
                message: "Leave approval updated successfully",
                success: true
            }
            
        } catch (error) {
            console.error("Error in updateLeaveApproval service:", error);
            throw new Error("Failed to update leave approval"); 
            
        }
    }

    async getAllLeaveEmployees(): Promise<ILeaveDTO[]> {
        try {
            const results = await this._leaveRepository.getAllLeaveEmployees();
        
            console.log("results from service ---------------", results);
            
            return results.map((result) => {
                // Assuming the result follows the structure of IEmployeeAttendance
                const attendanceEntry = result.attendance?.[0]; // Access the first attendance entry
    
                // Map attendance.status to ILeaveDTO.status
                const mappedStatus: "Pending" | "Approved" | "Rejected" | "null" = 
                    attendanceEntry?.status === "Leave" ? "Pending" :
                    attendanceEntry?.status === "Present" ? "null" :
                    attendanceEntry?.status === "Absent" ? "null" :
                    attendanceEntry?.status === "marked" ? "null" :
                    "null";  // Default case if no match is found
    
                return {
                    employeeId: result.employeeId.toString(), // Convert ObjectId to string
                    leaveType: attendanceEntry?.leaveType || '', // If leaveType exists, use it, otherwise default to ''
                    date: attendanceEntry?.date ? new Date(attendanceEntry.date) : null, // Convert string date to Date
                    reason: attendanceEntry?.reason || null, // If reason exists, use it, otherwise null
                    leaveStatus: attendanceEntry?.leaveStatus || 'null', // Default to 'null' if not provided
                    status: mappedStatus, // Use the mapped status
                    hours: attendanceEntry?.hours || 0, // Default to 0 if hours are not provided
                };
            });
        } catch (error) {
            console.error("Error in getAllLeaveEmployees service:", error);
            throw new Error("Failed to fetch leave employees");
        }
    }
    
    
    
}