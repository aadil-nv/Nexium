import BaseRepository from "../implementation/baseRepository";

import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import  IEmployee  from "../../entities/employeeEntities";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";
export default interface IAttendanceRepository extends BaseRepository<IEmployeeAttendance>  {

    updateAttendances(employeeId: string ,businessOwnerId: string): Promise<IEmployeeAttendance>;
    fetchAttendances(employeeId: string , businessOwnerId: string): Promise<IEmployeeAttendance>;
    findAttendanceByEmployeeId(employeeId: string,businessOwnerId: string): Promise<any>;
    createAttendanceRecord(employeeId: string,businessOwnerId: string): Promise<any>;
    
    findEmployeeById(employeeId: string,businessOwnerId: string): Promise<IEmployee>;
    applyLeave(employeeId: string, leaveData: any,businessOwnerId: string): Promise<any>;
    
    markCheckIn(id: string, attendanceData: any , employeeId: string,businessOwnerId: string): Promise<any>;
    markCheckOut(id: string, attendanceData: any , employeeId: string,businessOwnerId: string): Promise<any>;
    getPreviousMonthAttendance(employeeId: string,businessOwnerId: string): Promise<IEmployeeAttendance | null>
    getAttendanceDashboardData(employeeId: string,businessOwnerId: string): Promise<any>
    fetchApprovedLeaves(employeeId: string,businessOwnerId: string): Promise<IEmployeeLeave>;

}