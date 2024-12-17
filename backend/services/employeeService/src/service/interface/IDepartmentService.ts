import { IGetDepartmentDTO } from "../../dto/IDepartmentDTO";

export default interface IDepartmentService {
    getDepartment(employeeId: string): Promise<IGetDepartmentDTO>
}