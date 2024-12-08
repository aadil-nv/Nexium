import { IEmployeePersonalInformationDTO, IEmployeesDTO } from "../../dto/IEmployeesDTO";
import IEmployee from "../../entities/employeeEntities";
export default interface IEmployeeService {
    addEmployees(employeeData: any , managerData: any): Promise<any>;
    getEmployees():Promise<IEmployeesDTO[]>
    getEmployeePersonalInformation(employeeId: string): Promise<IEmployeePersonalInformationDTO>;
    getEmployeeAddress(employeeId: string): Promise<any>;
}