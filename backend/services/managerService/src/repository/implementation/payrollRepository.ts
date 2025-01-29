import { injectable, inject } from "inversify";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";
import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { Model } from "mongoose";

@injectable()
export default class PayrollRepository extends BaseRepository<IPayrollCriteria> implements IPayrollRepository {

    constructor(@inject("IPayrollCriteria") private payrollCriteriaModel: Model<IPayrollCriteria>) {
        super(payrollCriteriaModel);
    }

    async getPayrollCriteria(): Promise<IPayrollCriteria[]> {
        try {
            // Find existing payroll criteria
            let payrollCriteria = await this.payrollCriteriaModel.find({}).exec();

            // If no payroll criteria exist, create a new default one without any incentive slabs
            if (payrollCriteria.length === 0) {
                const defaultPayrollCriteria = new this.payrollCriteriaModel({
                    allowances: {
                        bonus: 0,
                        gratuity: 0,
                        medicalAllowance: 0,
                        hra: 0,
                        da: 0,
                        ta: 0,
                        overTime: {
                            type: 0,
                            overtimeEnabled: false
                        }
                    },
                    deductions: {
                        incomeTax: 0,
                        providentFund: 0,
                        professionalTax: 0,
                        esiFund: 0
                    },
                    incentives: [], // Empty array as no incentive slabs are needed
                    createdAt: new Date()
                });

                // Save the new payroll criteria
                payrollCriteria = [await defaultPayrollCriteria.save()];
            }

            return payrollCriteria;
        } catch (error) {
            console.error("Error fetching or creating payroll criteria:", error);
            throw new Error("Failed to fetch or create payroll criteria");
        }
    }
    async updatePayrollCriteria(payrollData: any, payrollId: string): Promise<IPayrollCriteria> {

        
        try {
            const updatedPayroll = await this.payrollCriteriaModel.findByIdAndUpdate(payrollId, payrollData, { new: true }).exec();
            if(!updatedPayroll) {
                throw new Error("Payroll criteria not found");
            }
            return updatedPayroll;
        } catch (error) {
            console.error("Error updating payroll criteria:", error);
            throw new Error("Failed to update payroll criteria");
        }
    }

    async deleteIncentive(incentiveId: string, payrollCriteriaId: string): Promise<IPayrollCriteria> {
        console.log("incentiveId", incentiveId);
        console.log("payrollCriteriaId", payrollCriteriaId);
        
        try {
            // Pull the incentive object from the incentives array by matching a unique identifier
            const updatedPayroll = await this.payrollCriteriaModel.findByIdAndUpdate(
                payrollCriteriaId, 
                { $pull: { incentives: { _id: incentiveId } } },  // Match by _id (assuming incentiveId corresponds to this field)
                { new: true }
            ).exec();
    
            if (!updatedPayroll) {
                throw new Error("Payroll criteria not found");
            }
            return updatedPayroll;
        } catch (error) {
            console.error("Error deleting incentive:", error);
            throw new Error("Failed to delete incentive");
        }
    }
    
}
