import { IAttendanceResponceDTO } from "../../dto/IAttendanceDTO";

export default interface IAttendanceService {
    fetchAttendances(employeeId: string , businessOwnerId: string): Promise<any>;
    markCheckin(data: any, employeeId: any , businessOwnerId: string): Promise<IAttendanceResponceDTO>;
    markCheckout(data: any, employeeId: any, businessOwnerId: string): Promise<IAttendanceResponceDTO>;
    fetchApprovedLeaves(employeeId: string, businessOwnerId: string): Promise<any>
    applyLeave(data: any, employeeId: any, businessOwnerId: string): Promise<IAttendanceResponceDTO>
    updateAttendanceEntry(employeeId: string, businessOwnerId: string): Promise<any>
}