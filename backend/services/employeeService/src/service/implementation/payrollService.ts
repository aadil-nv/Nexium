import { inject, injectable } from "inversify";
import IPayrollService  from "../../service/interface/IPayrollService";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";


@injectable()
export default class PayrollService implements IPayrollService {
    constructor(@inject("IPayrollRepository") private _payrollRepository: IPayrollRepository) {}

    async getPayroll(employeeId: string): Promise<any>{
        console.log("hitted get payroll-------- service--------------------------->>>");
        
       try {
        return await this._payrollRepository.getPayroll(employeeId);
       } catch (error) {
        console.error(error);
        throw error;
       }
    }
}