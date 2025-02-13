import IDepartment from "../../entities/departmentEntities";
import BaseRepository from "../../repository/implementation/baseRepository";

export default interface IDepartmentRepository extends BaseRepository<IDepartment> {
    getDepartment(departmentId: string , businessOwnerId: string): Promise<IDepartment>;
}