import {IAppliedLeave} from "../../entities/leaveTypeEntities";
import BaseRepository from "../implementation/baseRepository";

export default interface ILeaveRepository extends BaseRepository<IAppliedLeave> {
    applyLeave(employeeId: string, leaveData: any): Promise<IAppliedLeave>;
}