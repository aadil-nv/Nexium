import BaseRepository from "../implementation/baseRepository";

import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import  IEmployee  from "../../entities/employeeEntities";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";
export default interface IAttendanceRepository extends BaseRepository<IEmployeeAttendance>  {

    updateAttendances(employeeId: string): Promise<IEmployeeAttendance>;
    fetchAttendances(employeeId: string): Promise<IEmployeeAttendance>;
    findAttendanceByEmployeeId(employeeId: string): Promise<any>;
    createAttendanceRecord(employeeId: string): Promise<any>;
    
    findEmployeeById(employeeId: string): Promise<IEmployee>;
    applyLeave(employeeId: string, leaveData: any): Promise<any>;
    
    markCheckIn(id: string, attendanceData: any , employeeId: string): Promise<any>;
    markCheckOut(id: string, attendanceData: any , employeeId: string): Promise<any>;
    getPreviousMonthAttendance(employeeId: string): Promise<IEmployeeAttendance | null>
    getAttendanceDashboardData(employeeId: string): Promise<any>
    fetchApprovedLeaves(employeeId: string): Promise<IEmployeeLeave>;

}