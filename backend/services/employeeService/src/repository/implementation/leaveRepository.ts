import { injectable , inject } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import {IAppliedLeave} from "../../entities/leaveTypeEntities";
import ILeaveRepository from "../../repository/interface/ILeaveRepository";

@injectable()
export default class LeaveRepository extends BaseRepository<IAppliedLeave> implements ILeaveRepository {
    constructor(@inject("IAppliedLeave") private appliedLeaveModel: Model<IAppliedLeave>) {
        super(appliedLeaveModel);
    }

    async applyLeave(employeeId: string, leaveData: any): Promise<IAppliedLeave> {
        try {
            const leave = new this.appliedLeaveModel(leaveData);
            leave.employeeId = employeeId;
            return await leave.save();
            
        } catch (error) {
            console.error("Error applying leave:", error);
            throw error;
        }
    }
}