import { IEmployeeDTO } from "../../dto/employeeDTO";

export default interface IEmployeeService { 
    getProfile(employeeId: string, businessOwnerId: string): Promise<any>;
    getAllEmployees(businessOwnerId: string): Promise<IEmployeeDTO[]>;
    addEmployee(employeeData: any, businessOwnerId: string): Promise<any>;
    removeEmployee(employeeId: string, businessOwnerId: string): Promise<any>;
    blockEmployee(employeeId: string, businessOwnerId: string): Promise<any>;

    updateProfessionalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>;
    updateAddressInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>;
    updateSecurityInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any>;
    updatePersonalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<IEmployeeDTO>;
    uploadProfilePic(businessOwnerId:string ,employeeId :string, file:any):Promise<any>
}