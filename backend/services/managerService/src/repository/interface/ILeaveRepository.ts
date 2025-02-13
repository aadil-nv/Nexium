import { IPayrollCriteria } from "entities/payrollCriteriaEntities";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import BaseRepository from "../implementation/baseRepository";
import { ILeaveType} from "../../entities/leaveTypeEntities";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";
import { IAppliedLeave } from "entities/appliedLeaveEntities";


export default interface ILeaveRepository extends BaseRepository<IEmployeeAttendance> {
    updateLeaveApproval(employeeId: string, data:object, businessOwnerId: string): Promise<IEmployeeAttendance | null>;
    getAllLeaveEmployees(buisinessownerId:string): Promise<IEmployeeAttendance[]>
    findAllLeaveTypes(businessOwnerId: string): Promise<ILeaveType>
    updateLeaveTypes(leaveTypeId: string, data: any , businessOwnerId: string): Promise<ILeaveType>
    getEmployeeLeaves(employeeId: string, businessOwnerId: string): Promise<IEmployeeLeave>
    fetchAllPreAppliedLeaves(businessOwnerId: string):Promise <IAppliedLeave[]>
    updatePreAppliedLeaves(employeeId: string,managerName: string, data: any,businessOwnerId: string): Promise<IAppliedLeave | null>
}