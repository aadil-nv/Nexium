import { ID } from "aws-sdk/clients/s3";
import IDepartment from "../../entities/departmentEntities";
import BaseRepository from "../../repository/implementation/baseRepository";

export default interface IDepartmentRepository extends BaseRepository<IDepartment> {
    getDepartment(departmentId: string): Promise<IDepartment>;
}