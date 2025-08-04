import { injectable, inject } from "inversify";
import IPayrollService from "../interface/IPayrollService";
import IPayrollRepository from "../../repository/interface/IPayrollRepository"; 
import { IPayrollCriteria } from "entities/payrollCriteriaEntities";
import { IPayrollCriteriaDTO } from "dto/IPayrollDTO";

@injectable()
export default class PayrollService implements IPayrollService {
    constructor(@inject("IPayrollRepository") private _payrollRepository: IPayrollRepository) {}

    async getPayrollCriteria(businessOwnerId: string): Promise<IPayrollCriteriaDTO[]> {
        try {
            const payrollCriteriaList = await this._payrollRepository.getPayrollCriteria(businessOwnerId);

            if (!payrollCriteriaList || payrollCriteriaList.length === 0) {
                throw new Error("Payroll criteria not found");
            }

            const payrollCriteriaDTOList: IPayrollCriteriaDTO[] = payrollCriteriaList.map(payrollCriteria => {
                return {
                    _id: payrollCriteria._id,
                    allowances: {
                        bonus: payrollCriteria.allowances.bonus,
                        gratuity: payrollCriteria.allowances.gratuity,
                        medicalAllowance: payrollCriteria.allowances.medicalAllowance,
                        hra: payrollCriteria.allowances.hra,
                        da: payrollCriteria.allowances.da,
                        ta: payrollCriteria.allowances.ta,
                        overTime: {
                            type: payrollCriteria.allowances.overTime.type,
                            overtimeEnabled: payrollCriteria.allowances.overTime.overtimeEnabled,
                        },
                    },
                    deductions: {
                        incomeTax: payrollCriteria.deductions.incomeTax,
                        providentFund: payrollCriteria.deductions.providentFund,
                        professionalTax: payrollCriteria.deductions.professionalTax,
                        esiFund: payrollCriteria.deductions.esiFund,
                    },
                    incentives: payrollCriteria.incentives.map(incentive => ({
                        _id: incentive._id,
                        incentiveName: incentive.incentiveName,
                        minTaskCount: incentive.minTaskCount,
                        maxTaskCount: incentive.maxTaskCount,
                        percentage: incentive.percentage,
                    })),
                    payDay:payrollCriteria.payDay,
                    createdAt: payrollCriteria.createdAt,
                };
            });

            return payrollCriteriaDTOList;

        } catch (error) {
            console.error("Error in PayrollService:", error);
            throw new Error("Error fetching payroll criteria");
        }
    }

    async updatePayrollCriteria(payrollData: IPayrollCriteria, payrollId: string ,businessOwnerId: string): Promise<IPayrollCriteriaDTO> {
        try {
            const updatedPayroll = await this._payrollRepository.updatePayrollCriteria(payrollData, payrollId ,businessOwnerId);
            return updatedPayroll;
        } catch (error) {
            console.error("Error in PayrollService:", error);
            throw new Error("Error updating payroll criteria");
        }
    }

    async deleteIncentive(incentiveId: string, data:any,businessOwnerId: string): Promise<IPayrollCriteria> {
        try {
            const payrollCriteriaId = data.payrollCriteriaId;
            const updatedPayroll = await this._payrollRepository.deleteIncentive(incentiveId, payrollCriteriaId,businessOwnerId);
            return updatedPayroll;
        } catch (error) {
            console.error("Error in PayrollService:", error);
            throw new Error("Error deleting incentive");
        }
    }   

}
