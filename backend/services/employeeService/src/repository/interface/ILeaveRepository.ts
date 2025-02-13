import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import {IAppliedLeave} from "../../entities/appliedLeaveEntities";
import BaseRepository from "../implementation/baseRepository";
import { IEmployeeLeave } from "entities/employeeLeaveEntities";

export default interface ILeaveRepository extends BaseRepository<IAppliedLeave> {
    applyLeave(employeeId: string, leaveData: any ,businessOwnerId: string): Promise<IAppliedLeave>;
    fetchAppliedLeaves(employeeId: string ,businessOwnerId: string): Promise<IAppliedLeave[]> 
    updateAppliedLeave(employeeId: string, leaveId: string, leaveData:any ,businessOwnerId: string): Promise<IAppliedLeave>
    deleteAppliedLeave(employeeId: string, leaveId: string ,businessOwnerId: string): Promise<IAppliedLeave | null>
    approvedLasmonthLeaves(employeeId: string ,businessOwnerId: string): Promise<any>
    getEmployeeLeaves(employeeId: string, businessOwnerId: string): Promise<IEmployeeLeave | null>
}