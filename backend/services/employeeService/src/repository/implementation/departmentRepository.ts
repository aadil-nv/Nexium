import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import IDepartment from "../../entities/departmentEntities";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";

@injectable()
export default class DepartmentRepository extends BaseRepository<IDepartment> implements IDepartmentRepository {
    constructor(@inject("IDepartment") private _departmentModel: Model<IDepartment>) {
        super(_departmentModel);
    }

    async getDepartment(departmentId: string): Promise<IDepartment> {
        
        try {
            const department = await this._departmentModel.findOne({ _id:departmentId }).exec();
            
             if(!department){
                throw new Error("Department not found");
             }
            return department;
        } catch (error:any) {
            console.error(error);
            throw new Error("Error fetching department: " + error.message);
        }
    }
}