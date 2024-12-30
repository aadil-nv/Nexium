import { IEmployeeFullDataDTO, IEmployeePersonalInformationDTO, IEmployeesDTO } from "../../dto/IEmployeesDTO";
import IEmployee from "../../entities/employeeEntities";
export default interface IEmployeeService {
    addEmployees(employeeData: any , managerData: any): Promise<any>;
    getEmployees():Promise<IEmployeesDTO[]>


    updateEmployeePersonalInformation(employeeId: string ,personalInformation: any): Promise<IEmployeePersonalInformationDTO>;

    updateAddress(employeeId: string , address: any): Promise<any>;
    updateEmployeeProfessionalInfo(employeeId: string ,professionalInfo: any): Promise<any>;
    getEmployeeCredentials(employeeId: string): Promise<any>;
    getEmployeeDocuments(employeeId: string): Promise<any>;
    getEmployee(employeeId: string ,): Promise<IEmployeeFullDataDTO >;
    updateProfilePicture(employeeId: string ,file: Express.Multer.File): Promise<any>;
    updateResume(employeeId: string ,file: Express.Multer.File): Promise<any>;
    updateBlocking(employeeId: string ,blocking: any): Promise<any>;
    getEmployeeWithOutDepartment(): Promise<IEmployeesDTO[]>
    removeEmployee(employeeId: string): Promise<any>;
    updateCredentials(employeeId: string ,credentials: any): Promise<any>;
}