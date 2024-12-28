import { DepartmentWithEmployeesDTO } from "../../dto/IDepartmentDTO";

export default interface IDepartmentService {
    getDepartment(employeeId: string): Promise<DepartmentWithEmployeesDTO>
}