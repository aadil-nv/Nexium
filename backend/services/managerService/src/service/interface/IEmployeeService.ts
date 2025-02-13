import { IEmployeeFullDataDTO, IEmployeePersonalInformationDTO, IEmployeesDTO } from "../../dto/IEmployeesDTO";
import IEmployee from "../../entities/employeeEntities";
export default interface IEmployeeService {
    addEmployees(employeeData: any , managerData: any , businessOwnerId: string): Promise<any>;

    getEmployees(buisinessownerId: string):Promise<IEmployeesDTO[]>
    getEmployeeWithOutDepartment(businessOwnerId:string): Promise<IEmployeesDTO[]>
    getEmployeeCredentials(employeeId: string,businessOwnerId:string): Promise<any>;
    getEmployeeDocuments(employeeId: string , businessOwnerId: string): Promise<any>;
    getEmployee(employeeId: string , businessOwnerId: string): Promise<IEmployeeFullDataDTO >;

    updateEmployeePersonalInformation(employeeId: string ,personalInformation: any , businessOwnerId: string): Promise<IEmployeePersonalInformationDTO>;
    updateAddress(employeeId: string , address: any , buisinessownerId: string): Promise<any>;
    updateEmployeeProfessionalInfo(employeeId: string ,professionalInfo: any, businessOwnerId: string): Promise<any>;
    updateProfilePicture(employeeId: string ,file: Express.Multer.File ,businessOwnerId:string): Promise<any>;
    updateResume(employeeId: string ,file: Express.Multer.File ,businessOwnerId:string): Promise<any>;
    updateBlocking(employeeId: string ,blocking: any,businessOwnerId:string): Promise<any>;
    removeEmployee(employeeId: string,businessOwnerId:string): Promise<any>;
    updateCredentials(employeeId: string ,credentials: any,businessOwnerId:string): Promise<any>;
}