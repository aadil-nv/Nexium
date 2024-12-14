import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "../implementation/baseRepository";


export default interface ILeaveRepository extends BaseRepository<IEmployeeAttendance> {
    updateLeaveApproval(employeeId: string, data:object): Promise<IEmployeeAttendance | null>;
    getAllLeaveEmployees(): Promise<IEmployeeAttendance[]>
}