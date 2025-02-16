import { injectable, inject } from "inversify";
import IPayrollRepository from "../../repository/interface/IPayrollRepository";
import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { Model } from "mongoose";
import connectDB from "../../config/connectDB";

@injectable()
export default class PayrollRepository extends BaseRepository<IPayrollCriteria> implements IPayrollRepository {

    constructor(@inject("IPayrollCriteria") private payrollCriteriaModel: Model<IPayrollCriteria>) {
        super(payrollCriteriaModel);
    }

    async getPayrollCriteria(businessOwnerId: string): Promise<IPayrollCriteria[]> {
        try {
            const db = await connectDB(businessOwnerId);

            const payrollCriteria = await db.model<IPayrollCriteria>("PayrollCriteria", this.payrollCriteriaModel.schema).find({businessOwnerId}).exec();

            if (payrollCriteria.length === 0) {
                const defaultPayrollCriteria = new this.payrollCriteriaModel({
                    businessOwnerId,
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
                await defaultPayrollCriteria.save();
                return [defaultPayrollCriteria]; // Return the newly created default payroll criteria
            }

            return payrollCriteria;
        } catch (error) {
            console.error("Error fetching or creating payroll criteria:", error);
            throw new Error("Failed to fetch or create payroll criteria");
        }
    }
    
    async updatePayrollCriteria(payrollData: any, payrollId: string, businessOwnerId: string): Promise<IPayrollCriteria> {
        try {
            const db = await connectDB(businessOwnerId);
    
            // Correct model usage to access the payrollCriteria collection
            const updatedPayroll = await db.model<IPayrollCriteria>("PayrollCriteria", this.payrollCriteriaModel.schema)
                .findByIdAndUpdate(payrollId, payrollData, { new: true })
                .exec();
    
            if (!updatedPayroll) {
                throw new Error("Payroll criteria not found");
            }
    
            return updatedPayroll;
        } catch (error) {
            console.error("Error updating payroll criteria:", error);
            throw new Error("Failed to update payroll criteria");
        }
    }
    
    async deleteIncentive(incentiveId: string, payrollCriteriaId: string, businessOwnerId: string): Promise<IPayrollCriteria> {
        try {
            const db = await connectDB(businessOwnerId);
    
            const updatedPayroll = await db.model<IPayrollCriteria>("PayrollCriteria", this.payrollCriteriaModel.schema)
                .findByIdAndUpdate(
                    payrollCriteriaId, 
                    { $pull: { incentives: { _id: incentiveId } } }, 
                    { new: true } 
                )
                .exec();
    
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
