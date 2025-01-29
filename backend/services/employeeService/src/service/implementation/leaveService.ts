import { inject, injectable } from "inversify";
import ILeaveService from "../interface/ILeaveService";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import { ILeaveDTO } from "../../dto/ILeaveDTO";

@injectable()
export default class LeaveService implements ILeaveService {
  constructor(@inject("ILeaveRepository") 
  private _leaveRepository: ILeaveRepository,
  ) {}

  async applyLeave(employeeId: string, leaveData: Partial<ILeaveDTO>): Promise<ILeaveDTO> {
    try {
        // Apply the leave using the repository
        const leave = await this._leaveRepository.applyLeave(employeeId, leaveData);

        if (!leave) {
            return {
                message: "Failed to apply leave",
                success: false,
            };
        }

        // Ensure leaveDetails is treated as an array of objects
        

        // Map the repository result to the DTO
        const leaveDTO: ILeaveDTO = {
            leaveId: leave._id,
            employeeId: leave.employeeId,
            leaveType: leave.leaveType, // Now correctly accessing leaveType
            reason: leave.reason,
            startDate: new Date(leave.startDate),
            endDate: new Date(leave.endDate),
            duration: leave.duration || 0,
            message: "Leave applied successfully",
            success: true,
        };

        return leaveDTO;
    } catch (error: any) {
        console.error("Error applying leave service layer:", error.message);
        return {
            message: "An error occurred while applying leave",
            success: false,
        };
    }
}


  async fetchAppliedLeaves(employeeId: string): Promise<ILeaveDTO[]> {
    try {
        // Find all leave records for the given employeeId
        const appliedLeaves = await this._leaveRepository.fetchAppliedLeaves(employeeId);

        // Map the applied leaves to ILeaveDTO format
        const leaveDTOs: ILeaveDTO[] = appliedLeaves.map((leave) => ({
            leaveId: leave._id,                         // Assign the leave ID
            employeeId: leave.employeeId,               // Employee's ID
            leaveType: leave.leaveType,   // Join all leave types into a string
            reason: leave.reason,                       // Reason for the leave
            startDate: leave.startDate,                 // Start date of the leave
            endDate: leave.endDate,                     // End date of the leave
            duration: leave.duration,                   // Duration of the leave
            message: "Leave fetched successfully",      // Success message
            success: true,                              // Success status
            appliedAt: leave.appliedAt,                 // Applied date
            approvedBy: leave.approvedBy,               // Approved date
            rejectionReason: leave.rejectionReason,     // Rejection reason
            status: leave.status,                       // Leave status
        }));

        return leaveDTOs;
    } catch (error) {
        console.error("Error fetching applied leaves:", error);
        throw new Error("Error fetching applied leaves");
    }
}


async updateAppliedLeave(employeeId: string, leaveId: string, leaveData: any): Promise<ILeaveDTO> {
    try {
        // Update the leave using the repository
        const updatedLeave = await this._leaveRepository.updateAppliedLeave(employeeId, leaveId, leaveData);

        if (!updatedLeave) {
            return {
                message: "Failed to update leave",
                success: false,
            }
        }

        // Map the updated leave to ILeaveDTO format
        const leaveDTO: ILeaveDTO = {
            leaveId: updatedLeave._id,
            employeeId: updatedLeave.employeeId,
            leaveType: updatedLeave.leaveType, // Now correctly accessing leaveType
            reason: updatedLeave.reason,
            startDate: new Date(updatedLeave.startDate),
            endDate: new Date(updatedLeave.endDate),
            duration: updatedLeave.duration || 0,
            message: "Leave updated successfully",
            success: true,
        };

        return leaveDTO;
    } catch (error) {
        console.error("Error updating applied leave:", error);
        throw new Error("Error updating applied leave");
    }
}

async deleteAppliedLeave(employeeId: string, leaveId: string): Promise<ILeaveDTO> {
    try {
        // Call the repository to delete the leave
        const deletedLeave = await this._leaveRepository.deleteAppliedLeave(employeeId, leaveId);

        if (!deletedLeave) {
            throw new Error("No leave found for the provided employeeId and leaveId");
        }

        // Map the deleted leave to ILeaveDTO format
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
        };

        return leaveDTO;
    } catch (error: any) {
        console.error("Error deleting applied leave:", error.message || error);
        throw new Error("Error deleting applied leave");
    }
}




}
  

