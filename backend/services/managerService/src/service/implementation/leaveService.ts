import { injectable,inject } from "inversify";
import ILeaveService from "../interface/ILeaveService";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import {ILeaveResonseDTO ,ILeaveDTO, ILeaveTypesDTO} from "../../dto/ILeaveDTO";
import { ILeaveType } from "entities/leaveTypeEntities";




@injectable()
export default class LeaveService implements ILeaveService {
    constructor(@inject("ILeaveRepository") private _leaveRepository: ILeaveRepository) {}

    async updateLeaveApproval(employeeId: string, data:object): Promise<ILeaveResonseDTO> {
        try {
            const result = await this._leaveRepository.updateLeaveApproval(employeeId, data);
            
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
    
           
            // Flatten all attendance entries across employees
            const leaveDTOs: ILeaveDTO[] = results.flatMap((result) => {
                return result.attendance?.map((attendanceEntry) => {
                    // Map attendance.status to ILeaveDTO.status
                    const mappedStatus: "Pending" | "Approved" | "Rejected" | "null" =
                        attendanceEntry?.status === "Leave" ? "Pending" :
                        attendanceEntry?.status === "Present" ? "null" :
                        attendanceEntry?.status === "Absent" ? "null" :
                        attendanceEntry?.status === "marked" ? "null" :
                        "null"; // Default case if no match is found
    
                    return {
                        employeeId: result.employeeId.toString(), // Convert ObjectId to string
                        leaveType: attendanceEntry?.leaveType || '', // If leaveType exists, use it, otherwise default to ''
                        date: attendanceEntry?.date ? new Date(attendanceEntry.date) : null, // Convert string date to Date
                        reason: attendanceEntry?.reason || null, // If reason exists, use it, otherwise null
                        leaveStatus: attendanceEntry?.leaveStatus || 'null', // Default to 'null' if not provided
                        status: mappedStatus, // Use the mapped status
                        hours: attendanceEntry?.hours || 0, // Default to 0 if hours are not provided
                    };
                }) || []; // Handle cases where attendance might be null/undefined
            });
    
            return leaveDTOs;
        } catch (error) {
            console.error("Error in getAllLeaveEmployees service:", error);
            throw new Error("Failed to fetch leave employees");
        }
    }



    async getAllLeaveTypes(): Promise<ILeaveTypesDTO[]> {
        try {
            const result = await this._leaveRepository.findAllLeaveTypes();

            if (!result) {
                throw new Error("No leave types found");
            }

            const leaveTypesDTO: ILeaveTypesDTO = {
                _id: result._id,
                sickLeave: result.sickLeave,
                casualLeave: result.casualLeave,
                maternityLeave: result.maternityLeave,
                paternityLeave: result.paternityLeave,
                paidLeave: result.paidLeave,
                unpaidLeave: result.unpaidLeave,
                compensatoryLeave: result.compensatoryLeave,
                bereavementLeave: result.bereavementLeave,
                marriageLeave: result.marriageLeave,
                studyLeave: result.studyLeave,
            };

            return [leaveTypesDTO];
        } catch (error) {
            console.error("Error in getAllLeaveTypes service:", error);
            throw new Error("Failed to fetch leave types");
        }
    }
    
    
    async  updateLeaveTypes(leaveTypeId: string, data: ILeaveTypesDTO): Promise<ILeaveResonseDTO> {
        try {
            const result = await this._leaveRepository.updateLeaveTypes(leaveTypeId, data);
            return {
                message: "Leave approval updated successfully",
                success: true
            }
        } catch (error) {
            console.error("Error in updateLeaveTypes service:", error);
            throw new Error("Failed to update leave types");
        }
    }
    
    
    
    
    
}