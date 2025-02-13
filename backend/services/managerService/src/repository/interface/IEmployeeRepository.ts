import IEmployee from "../../entities/employeeEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { IEmployeesDTO } from "dto/IEmployeesDTO";

export default interface IEmployeeRepository extends BaseRepository<any>  {
    getEmployees(buisinessownerId: string):Promise<IEmployee[]>
    addEmployee(employeeData:any, businessOwnerId: string ):Promise <any>
    findByEmail(email: string , businessOwnerId: string): Promise<IEmployee | null>
    getEmployeeInformation(employeeId: string, businessOwnerId: string): Promise<any>
    updateEmployeePersonalInformation(employeeId: string ,personalInformation: any,businessOwnerId:string): Promise<any>
    updateAddress(employeeId: string ,address: any,businessOwnerId:string): Promise<any>
    updateEmployeeProfessionalInfo(employeeId: string ,professionalInfo: any,businessOwnerId:string): Promise<any>
    getDepartmentName(departmentId: string, businessOwnerId: string): Promise<string | null>
    updateProfilePicture(employeeId: string, profilePicture: string, businessOwnerId: string): Promise<string>
    updateResume(employeeId: string, documentMetadata: any, businessOwnerId: string): Promise<any>
    updateBlocking(employeeId: string, blocking: any,businessOwnerId:string): Promise<any>
    getEmployeesWithoutDepartment(businessOwnerId:string): Promise<IEmployee[]>
    removeEmployee(employeeId: string,businessOwnerId:string): Promise<any>
    updateCredentials(employeeId: string ,credentials: any ,businessOwnerId:string): Promise<any>
    getAllTeamLeads(businessOwnerId: string): Promise<IEmployee[]>
}