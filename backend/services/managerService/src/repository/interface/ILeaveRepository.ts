import { IPayrollCriteria } from "entities/payrollCriteriaEntities";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "../implementation/baseRepository";
import { ILeaveType} from "entities/leaveTypeEntities";


export default interface ILeaveRepository extends BaseRepository<IEmployeeAttendance> {
    updateLeaveApproval(employeeId: string, data:object): Promise<IEmployeeAttendance | null>;
    getAllLeaveEmployees(): Promise<IEmployeeAttendance[]>
    findAllLeaveTypes(): Promise<ILeaveType>
    updateLeaveTypes(leaveTypeId: string, data: any): Promise<ILeaveType>
}