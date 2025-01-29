import { ILeaveDTO } from "../../dto/ILeaveDTO";


export default interface ILeaveService {
    applyLeave(employeeId: string, leaveData: any): Promise<ILeaveDTO>
    fetchAppliedLeaves(employeeId:string):Promise<ILeaveDTO[]>
    updateAppliedLeave(employeeId:string,leaveId:string,leaveData:any):Promise<ILeaveDTO>
    deleteAppliedLeave(employeeId: string, leaveId: string): Promise<ILeaveDTO>
}