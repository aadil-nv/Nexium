import { ILeaveResonseDTO,ILeaveDTO } from "../../dto/ILeaveDTO";

export default interface ILeaveService {
    updateLeaveApproval(employeeId: string, leaveId: string, leaveStatus: string): Promise<ILeaveResonseDTO>
    getAllLeaveEmployees(): Promise<ILeaveDTO[]>
}