import IEmployee from "entities/employeeEntities";
import BaseRepository from "../../repository/implementation/baseRepository";

export default interface IEmployeeRepository extends BaseRepository<any>  {
    getEmployees():Promise<IEmployee[]>
    addEmployee(employeeData:any ):Promise <any>
    findByEmail(email: string): Promise<IEmployee | null>

}