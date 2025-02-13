import  IEmployee  from "../../entities/employeeEntities";
import  BaseRepository  from "../implementation/baseRepository";

export default interface IEmployeeRepository extends BaseRepository<IEmployee> {
        getProfile(employeeId: string ,businessOwnerId: string): Promise<IEmployee>;
        findBusinessOwnerId(employeeId: string,businessOwnerId:string): Promise<string>;
        updateProfile(employeeId: string, data: any,businessOwnerId:string): Promise<IEmployee>;
        updateProfilePicture(employeeId: string, file: string,businessOwnerId:string): Promise<IEmployee>;
        updateAddress(employeeId: string, data: any,businessOwnerId:string): Promise<IEmployee>;
        uploadDocuments(employeeId: string, fileType: "resume", documentData: any,businessOwnerId:string): Promise<IEmployee>;
        getEmployeeDashboardData(employeeId: string,businessOwnerId:string): Promise<any>
        updateIsActive(employeeId: string, isActive: boolean,businessOwnerId:string): Promise<IEmployee>
        findEmployeeIsBlocked(employeeId: string,businessOwnerId: string): Promise<boolean>
        findBusinessOwnerIsBlocked(employeeId: string,businessOwnerId: string): Promise<boolean>
}


