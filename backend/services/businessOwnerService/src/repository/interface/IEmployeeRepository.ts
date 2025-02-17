import { IBusinessOwnerDocument } from "entities/businessOwnerEntity";
import IEmployee from "../../entities/employeeEntity";

export default interface IEmployeeRepository {
    getProfile(employeeId: string, businessOwnerId: string): Promise<void>;
    getDashboardData(businessOwnerId:string):Promise <any>
    getAllEmployees(businessOwnerId: string): Promise<IEmployee[]>
    addEmployee(employeeData: any, businessOwnerId: string): Promise<any>
    getBusinessOwnerData(businessOwnerId: string): Promise<IBusinessOwnerDocument>
    findByEmail(businessOwnerId: string, emailId: string): Promise<any>
    removeEmployee(employeeId: string, businessOwnerId: string): Promise<any>
    blockEmployee(employeeId: string, businessOwnerId: string): Promise<any>

    updateProfessionalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>
    updateAddressInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>
    updateSecurityInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>
    updatePersonalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>
    uploadProfilePic(employeeId: string, businessOwnerId: string, fileUrl:string): Promise<any>

    getEmployeeLeave(businessOwnerId: string): Promise<any>
    updateEmployeeLeaveInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>
}