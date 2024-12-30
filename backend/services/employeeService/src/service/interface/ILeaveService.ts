import { ILeaveDTO } from "../../dto/ILeaveDTO";


export default interface ILeaveService {
    applyLeave(employeeId: string, leaveData: any): Promise<ILeaveDTO>
}