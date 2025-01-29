import { IAttendanceEntry } from "../../entities/attendanceEntities";
import { IAttendanceResponceDTO } from "../../dto/IAttendanceDTO";

export default interface IAttendanceService {
    fetchAttendances(employeeId: string): Promise<any>;
    markCheckin(data: any, employeeId: any): Promise<IAttendanceResponceDTO>;
    markCheckout(data: any, employeeId: any): Promise<IAttendanceResponceDTO>;
    fetchApprovedLeaves(employeeId: string): Promise<any>
    applyLeave(data: any, employeeId: any): Promise<IAttendanceResponceDTO>
    updateAttendanceEntry(employeeId: string): Promise<any>
}