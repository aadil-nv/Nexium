import BaseRepository from "../implementation/baseRepository";
import { IPayroll } from "../../entities/payrollEntities";

export default interface IEmployeeRepository extends BaseRepository<IPayroll>  {
    getPayroll(employeeId: string): Promise<IPayroll>;
    

} 