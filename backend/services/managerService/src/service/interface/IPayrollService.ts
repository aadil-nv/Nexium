import { IPayrollCriteriaDTO } from "../../dto/IPayrollDTO";

export default interface IPayrollService {
    getPayrollCriteria(): Promise<IPayrollCriteriaDTO[]>
    updatePayrollCriteria(payrollData: any, payrollId: string): Promise<IPayrollCriteriaDTO>
    deleteIncentive(incentiveId: string, data: any): Promise<IPayrollCriteriaDTO>
}