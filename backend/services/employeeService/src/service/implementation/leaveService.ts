import { inject, injectable } from "inversify";
import ILeaveService from "../interface/ILeaveService";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";
import { ILeaveDTO } from "../../dto/ILeaveDTO";

@injectable()
export default class LeaveService implements ILeaveService {
    constructor(@inject("ILeaveRepository") private leaveRepository: ILeaveRepository) {}

    async applyLeave(employeeId: string, leaveData: Partial<ILeaveDTO>): Promise<ILeaveDTO> {
        try {
            // Apply the leave using the repository
            const leave = await this.leaveRepository.applyLeave(employeeId, leaveData);

            if (!leave) {
                return {

                    message: "Failed to apply leave",
                    success: false,
                };
            }

            // Map the repository result to the DTO
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
            };

            return leaveDTO;
        } catch (error: any) {
            console.error("Error applying leave:", error.message);
            return {

                message: "An error occurred while applying leave",
                success: false,
            };
        }
    }
}
