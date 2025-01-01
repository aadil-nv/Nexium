import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import {IAppliedLeave} from "../../entities/appliedLeaveEntities";
import BaseRepository from "../implementation/baseRepository";

export default interface ILeaveRepository extends BaseRepository<IAppliedLeave> {
    applyLeave(employeeId: string, leaveData: any): Promise<IAppliedLeave>;
    fetchAppliedLeaves(employeeId: string): Promise<IAppliedLeave[]> 
    updateAppliedLeave(employeeId: string, leaveId: string, leaveData:any): Promise<IAppliedLeave>
    deleteAppliedLeave(employeeId: string, leaveId: string): Promise<IAppliedLeave | null>
    approvedLasmonthLeaves(employeeId: string): Promise<any>
}