import BaseRepository from "../implementation/baseRepository";

import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import  IEmployee  from "../../entities/employeeEntities";
export default interface IAttendanceRepository extends BaseRepository<IEmployeeAttendance>  {
    fetchAttendances(employeeId: string): Promise<any>;
    findAttendanceByEmployeeId(employeeId: string): Promise<any>;
    createAttendanceRecord(employeeId: string): Promise<any>;
    updateAttendance(id: string, attendanceData: any): Promise<any>;
    findEmployeeById(employeeId: string): Promise<IEmployee>;
}