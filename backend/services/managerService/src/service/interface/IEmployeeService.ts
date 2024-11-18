import IEmployee from "../../entities/employeeEntities";
export default interface IEmployeeService {
    addEmployees(employeeData: any , refreshToken: string): Promise<any>;
    getEmployees():Promise<any>
}