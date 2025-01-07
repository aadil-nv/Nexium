import IEmployee from "../../entities/employeeEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { IEmployeesDTO } from "dto/IEmployeesDTO";

export default interface IEmployeeRepository extends BaseRepository<any>  {
    getEmployees():Promise<IEmployee[]>
    addEmployee(employeeData:any ):Promise <any>
    findByEmail(email: string): Promise<IEmployee | null>
    getEmployeeInformation(employeeId: string): Promise<any>
    updateEmployeePersonalInformation(employeeId: string ,personalInformation: any): Promise<any>
    updateAddress(employeeId: string ,address: any): Promise<any>
    updateEmployeeProfessionalInfo(employeeId: string ,professionalInfo: any): Promise<any>
    getDepartmentName(departmentId: string): Promise<string>
    updateProfilePicture(employeeId: string ,profilePicture: any): Promise<any>
    updateResume(employeeId: string, documentMetadata: any): Promise<any>
    updateBlocking(employeeId: string, blocking: any): Promise<any>
    getEmployeeWithOutDepartment(): Promise<IEmployee[]>
    removeEmployee(employeeId: string): Promise<any>
    updateCredentials(employeeId: string ,credentials: any): Promise<any>
    getAllTeamLeads(): Promise<IEmployee[]>
}