import { IEmployeePersonalInformationDTO, IEmployeesDTO } from "../../dto/IEmployeesDTO";
import IEmployee from "../../entities/employeeEntities";
export default interface IEmployeeService {
    addEmployees(employeeData: any , managerData: any): Promise<any>;
    getEmployees():Promise<IEmployeesDTO[]>


    updateEmployeePersonalInformation(employeeId: string ,personalInformation: any): Promise<IEmployeePersonalInformationDTO>;

    updateAddress(employeeId: string , address: any): Promise<any>;
    updateEmployeeProfessionalInfo(employeeId: string ,professionalInfo: any): Promise<any>;
    getEmployeeCredentials(employeeId: string): Promise<any>;
    getEmployeeDocuments(employeeId: string): Promise<any>;
    getEmployee(employeeId: string ,): Promise<IEmployee>;
}