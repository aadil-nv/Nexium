import { ILeaveDTO } from "../../dto/ILeaveDTO";


export default interface ILeaveService {
    applyLeave(employeeId: string, leaveData: any, businessOwnerId: string): Promise<ILeaveDTO>
    fetchAppliedLeaves(employeeId:string , businessOwnerId: string):Promise<ILeaveDTO[]>
    updateAppliedLeave(employeeId:string,leaveId:string,leaveData:any , businessOwnerId: string):Promise<ILeaveDTO>
    deleteAppliedLeave(employeeId: string, leaveId: string , businessOwnerId: string): Promise<ILeaveDTO>
}