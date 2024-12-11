import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "../implementation/baseRepository";


export default interface ILeaveRepository extends BaseRepository<IEmployeeAttendance> {
    updateLeaveApproval(employeeId: string, leaveId: string, leaveStatus: string): Promise<IEmployeeAttendance | null>;
    getAllLeaveEmployees(): Promise<IEmployeeAttendance[]>
}