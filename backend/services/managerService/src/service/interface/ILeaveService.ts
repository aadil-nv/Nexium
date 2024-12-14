import { ILeaveResonseDTO,ILeaveDTO } from "../../dto/ILeaveDTO";

export default interface ILeaveService {
    updateLeaveApproval(employeeId: string, data:object): Promise<ILeaveResonseDTO>
    getAllLeaveEmployees(): Promise<ILeaveDTO[]>
}