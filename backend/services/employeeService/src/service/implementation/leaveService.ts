import { inject, injectable } from "inversify";
import ILeaveService from "../interface/ILeaveService";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import { ILeaveDTO } from "../../dto/ILeaveDTO";

@injectable()
export default class LeaveService implements ILeaveService {
  constructor(@inject("ILeaveRepository") 
  private _leaveRepository: ILeaveRepository,
  ) {}

  async applyLeave(employeeId: string, leaveData: Partial<ILeaveDTO> , businessOwnerId: string): Promise<ILeaveDTO> {
    try {
        const leave = await this._leaveRepository.applyLeave(employeeId, leaveData , businessOwnerId);

        if (!leave) {
            return {
                message: "Failed to apply leave",
                success: false,
            };
        }

        
        const leaveDTO: ILeaveDTO = {
            leaveId: leave._id,
            employeeId: leave.employeeId,
            leaveType: leave.leaveType, 
            reason: leave.reason,
            startDate: new Date(leave.startDate),
            endDate: new Date(leave.endDate),
            duration: leave.duration || 0,
            message: "Leave applied successfully",
            success: true,
            isFirstHalf: leave.isFirstHalf,
            isSecondHalf: leave.isSecondHalf
        };

        return leaveDTO;
    } catch (error: any) {
        console.error("Error applying leave service layer:", error.message);
        return {
            message: error.message,
            success: false,
        };
    }
}

  async fetchAppliedLeaves(employeeId: string ,businessOwnerId: string): Promise<ILeaveDTO[]> {
    try {
        const appliedLeaves = await this._leaveRepository.fetchAppliedLeaves(employeeId , businessOwnerId);

        const leaveDTOs: ILeaveDTO[] = appliedLeaves.map((leave) => ({
            leaveId: leave._id,                        
            employeeId: leave.employeeId,              
            leaveType: leave.leaveType,   
            reason: leave.reason,                      
            startDate: leave.startDate,                
            endDate: leave.endDate,                     
            duration: leave.duration,                   
            message: "Leave fetched successfully",      
            success: true,                              
            appliedAt: leave.appliedAt,                 
            approvedBy: leave.approvedBy,              
            rejectionReason: leave.rejectionReason,     
            status: leave.status,                       
            isFirstHalf: leave.isFirstHalf,
            isSecondHalf: leave.isSecondHalf
        }));

        return leaveDTOs;
    } catch (error) {
        console.error("Error fetching applied leaves:", error);
        throw new Error("Error fetching applied leaves");
    }
}

async updateAppliedLeave(employeeId: string, leaveId: string, leaveData: any ,businessOwnerId: string): Promise<ILeaveDTO> {
    try {
        const updatedLeave = await this._leaveRepository.updateAppliedLeave(employeeId, leaveId, leaveData ,businessOwnerId);

        if (!updatedLeave) {
            return {
                message: "Failed to update leave",
                success: false,
            }
        }
        const leaveDTO: ILeaveDTO = {
            leaveId: updatedLeave._id,
            employeeId: updatedLeave.employeeId,
            leaveType: updatedLeave.leaveType, 
            reason: updatedLeave.reason,
            startDate: new Date(updatedLeave.startDate),
            endDate: new Date(updatedLeave.endDate),
            duration: updatedLeave.duration || 0,
            message: "Leave updated successfully",
            success: true,
            isFirstHalf: updatedLeave.isFirstHalf,
            isSecondHalf: updatedLeave.isSecondHalf
        };

        return leaveDTO;
    } catch (error:any) {
        console.error("Error updating applied leave:", error.message);
        return {
            message: error.message,
            success: false,}
        }
}

async deleteAppliedLeave(employeeId: string, leaveId: string ,businessOwnerId: string): Promise<ILeaveDTO> {
    try {
        const deletedLeave = await this._leaveRepository.deleteAppliedLeave(employeeId, leaveId ,businessOwnerId);  
        if (!deletedLeave) {
            throw new Error("No leave found for the provided employeeId and leaveId");
        }

        const leaveDTO: ILeaveDTO = {
            leaveId: deletedLeave._id,
            employeeId: deletedLeave.employeeId.toString(),
            leaveType: deletedLeave.leaveType,
            reason: deletedLeave.reason,
            startDate: deletedLeave.startDate,
            endDate: deletedLeave.endDate,
            duration: deletedLeave.duration,
            message: "Leave deleted successfully",
            success: true,
            isFirstHalf: deletedLeave.isFirstHalf,
            isSecondHalf: deletedLeave.isSecondHalf
        };

        return leaveDTO;
    } catch (error: any) {
        console.error("Error deleting applied leave:", error.message || error);
        throw new Error("Error deleting applied leave");
    }
}


}
  

