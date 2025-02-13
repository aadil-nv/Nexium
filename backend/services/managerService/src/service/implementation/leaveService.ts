import { injectable,inject } from "inversify";
import ILeaveService from "../interface/ILeaveService";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import {ILeaveResonseDTO ,ILeaveDTO, ILeaveTypesDTO} from "../../dto/ILeaveDTO";
import { ILeaveType } from "entities/leaveTypeEntities";
import { duration } from "moment";
import { IAppliedLeaveDTO, IAppliedLeaveResponce } from "dto/IAppliedLeaveDTO";
import { time } from "console";
import IManagerRepository from "../../repository/interface/IManagerRepository";




@injectable()
export default class LeaveService implements ILeaveService {
    constructor(@inject("ILeaveRepository")
     private _leaveRepository: ILeaveRepository,
     @inject("IManagerRepository")
     private  _managerRepository: IManagerRepository) {}

    async updateLeaveApproval(employeeId: string, data: object ,businessOwnerId: string): Promise<ILeaveResonseDTO> {
        try {
            const result = await this._leaveRepository.updateLeaveApproval(employeeId, data, businessOwnerId); ;
    
            return {
                leaveStatus: result?.attendance[0].leaveStatus,
                message: "Leave approval updated successfully",
                success: true
            };
            
        } catch (error: any) {
            console.log("Error in updateLeaveApproval service:", error);
            return {
                message: error.message,
                success: false
            };
        }
    }
    

    async getAllLeaveEmployees(buisinessownerId: string): Promise<ILeaveDTO[]> {
    try {
        const results = await this._leaveRepository.getAllLeaveEmployees(buisinessownerId);

        const leaveDTOs: ILeaveDTO[] = results.flatMap((result) => {
            return result.attendance?.map((attendanceEntry) => {
                const mappedStatus: "Pending" | "Approved" | "Rejected" | "null" =
                    attendanceEntry?.status === "Leave" ? "Pending" :
                    attendanceEntry?.status === "Present" ? "null" :
                    attendanceEntry?.status === "Absent" ? "null" :
                    attendanceEntry?.status === "Marked" ? "null" :
                    "null"; 

                // Ensure that leaveStatus is one of the expected values
                const leaveStatus: "Pending" | "Approved" | "Rejected" | "null" = 
                    attendanceEntry?.leaveStatus === "Pending" ? "Pending" :
                    attendanceEntry?.leaveStatus === "Approved" ? "Approved" :
                    attendanceEntry?.leaveStatus === "Rejected" ? "Rejected" :
                    "null";  // Default to "null" if no valid value exists

                return {
                    employeeId: result.employeeId.toString(), // Convert ObjectId to string
                    leaveType: attendanceEntry?.leaveType || '', // If leaveType exists, use it, otherwise default to ''
                    date: attendanceEntry?.date ? new Date(attendanceEntry.date) : null, // Convert string date to Date
                    reason: attendanceEntry?.reason || null, // If reason exists, use it, otherwise null
                    leaveStatus, // Use the mapped leaveStatus value
                    status: mappedStatus, // Use the mapped status
                    minutes: attendanceEntry?.minutes || 0, // Ensure minutes is always provided
                    duration: attendanceEntry?.duration || null, // If duration exists, use it, otherwise null
                };
            }) || []; // Handle cases where attendance might be null/undefined
        });

        return leaveDTOs;
    } catch (error) {
        console.error("Error in getAllLeaveEmployees service:", error);
        throw new Error("Failed to fetch leave employees");
    }
    }


    async getAllLeaveTypes(businessOwnerId: string): Promise<ILeaveTypesDTO[]> {
        try {
            const result = await this._leaveRepository.findAllLeaveTypes(businessOwnerId);

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
    
    
    async  updateLeaveTypes(leaveTypeId: string, data: ILeaveTypesDTO ,businessOwnerId: string): Promise<ILeaveResonseDTO> {
        try {
            const result = await this._leaveRepository.updateLeaveTypes(leaveTypeId, data ,businessOwnerId);
            return {
                message: "Leave approval updated successfully",
                success: true
            }
        } catch (error) {
            console.error("Error in updateLeaveTypes service:", error);
            throw new Error("Failed to update leave types");
        }
    }
    

    async fetchAllPreAppliedLeaves(businessOwnerId: string): Promise<IAppliedLeaveDTO[]> {
        try {
          const leaves = await this._leaveRepository.fetchAllPreAppliedLeaves(businessOwnerId);
    
          const mappedLeaves: IAppliedLeaveDTO[] = leaves.map((leave) => ({
            _id:leave._id,
            employeeId: leave.employeeId?._id?.toString() || '',
            employeeName: leave.employeeId?.personalDetails?.employeeName || 'N/A',
            profilePicture: leave.employeeId?.personalDetails?.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${ leave.employeeId?.personalDetails?.profilePicture}` :leave.employeeId?.personalDetails?.profilePicture ,
            leaveType: leave.leaveType,
            reason: leave.reason,
            startDate: leave.startDate.toISOString(),
            endDate: leave.endDate.toISOString(),
            duration: leave.duration,
            status: leave.status,
            appliedAt: leave.appliedAt.toISOString(),
            approvedBy: leave.approvedBy || 'N/A',
            rejectionReason: leave.rejectionReason || 'N/A',
            daysCount: leave.daysCount,
          }));
    
          return mappedLeaves;
        } catch (error) {
          console.error('Error fetching pre-applied leaves:', error);
          throw new Error('Failed to fetch pre-applied leaves');
        }
    }


    async updatePreAppliedLeaves(employeeId: string, managerId: string, data: any ,businessOwnerId: string): Promise<IAppliedLeaveResponce> {
        try {
          // Fetch manager details
          const managerData = await this._managerRepository.getDetails(managerId , businessOwnerId);
          console.log("Manager data is:", managerData);
      
          const managerName = managerData.personalDetails.managerName;
          console.log("Manager name is:", managerName);
    
      
          const result = await this._leaveRepository.updatePreAppliedLeaves(employeeId,managerName, data ,businessOwnerId);
          console.log("Result of update:", result);
      
          if (!result) {
            throw new Error('Error occurred in updateLeaveApproval');
          }
      
          return { message: "Updated successfully", success: true };
        } catch (error) {
          console.error('Error updating pre-applied leaves:', error);
          throw new Error('Failed to update pre-applied leaves');
        }
    }
      
      
}


