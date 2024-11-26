import { IEmployeesDTO } from "../../dto/IEmployeesDTO";
import IEmployee from "../../entities/employeeEntities";
export default interface IEmployeeService {
    addEmployees(employeeData: any , managerData: any): Promise<any>;
    getEmployees():Promise<IEmployeesDTO[]>
}