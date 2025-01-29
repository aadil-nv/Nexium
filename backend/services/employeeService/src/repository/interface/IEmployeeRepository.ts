import  IEmployee  from "../../entities/employeeEntities";
import  BaseRepository  from "../implementation/baseRepository";
import {IManager} from "../../entities/managerEntities";

export default interface IEmployeeRepository extends BaseRepository<IEmployee> {
        getProfile(employeeId: string): Promise<IEmployee>;
        findBusinessOwnerId(employeeId: string): Promise<string>;
        updateProfile(employeeId: string, data: any): Promise<IEmployee>;
        updateProfilePicture(employeeId: string, file: string): Promise<IEmployee>;
        updateAddress(employeeId: string, data: any): Promise<IEmployee>;
        uploadDocuments(employeeId: string, fileType: "resume", documentData: any): Promise<IEmployee>;
        getEmployeeDashboardData(employeeId: string): Promise<any>
}


