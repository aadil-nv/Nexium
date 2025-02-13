import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import IDepartment from "../../entities/departmentEntities";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import connectDB from "../../config/connectDB";

@injectable()
export default class DepartmentRepository extends BaseRepository<IDepartment> implements IDepartmentRepository {
    constructor(@inject("IDepartment") private _departmentModel: Model<IDepartment>) {
        super(_departmentModel);
    }

    async getDepartment(departmentId: string, businessOwnerId: string): Promise<IDepartment> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const DepartmentModel = switchDB.model<IDepartment>('Department', this._departmentModel.schema);
    
            const department = await DepartmentModel
                .findOne({ _id: departmentId })
                .populate("employees.employeeId")  // Populate employeeId reference
                .exec();
    
            if (!department) {
                throw new Error("Department not found");
            }
    
            return department;
        } catch (error: any) {
            console.error(error);
            throw new Error("Error fetching department: " + error.message);
        }
    }
    
}