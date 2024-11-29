import  IEmployee  from "../../entities/employeeEntities";
import  BaseRepository  from "../implementation/baseRepository";
import {IManager} from "../../entities/managerEntities";

export default interface IEmployeeRepository extends BaseRepository<IEmployee> {
        getProfile(employeeId: string): Promise<IEmployee>;
        findBusinessOwnerId(employeeId: string): Promise<string>;
}


