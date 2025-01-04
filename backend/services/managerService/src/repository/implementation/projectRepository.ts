// import { injectable, inject } from "inversify";
// import IProjectRepository from "../../repository/interface/IProjectRepository";
// import { IPayroll } from "../../entities/projectEntities";
// import BaseRepository from "../../repository/implementation/baseRepository";
// import { Model } from "mongoose";

// @injectable()
// export default class ProjectRepository extends BaseRepository<IPayroll> implements IProjectRepository {

//     constructor(@inject("IProject") private projectModel: Model<IProject>) {
//         super(projectModel);
//     }

//     async getPayrollCriteria(): Promise<IProject> {
//         try {
//             // Find existing payroll criteria
//             let payrollCriteria = await this.projectModel.find({}).exec();

//             // If no payroll criteria exist, create a new default one without any incentive slabs
//             if (payrollCriteria.length === 0) {
//                 const defaultPayrollCriteria = new this.projectModel({
//                     allowances: {
//                         bonus: 0,
//                         gratuity: 0,
//                         medicalAllowance: 0,
//                         hra: 0,
//                         da: 0,
//                         ta: 0,
//                         overTime: {
//                             type: 0,
//                             overtimeEnabled: false
//                         }
//                     },
//                     deductions: {
//                         incomeTax: 0,
//                         providentFund: 0,
//                         professionalTax: 0,
//                         esiFund: 0
//                     },
//                     incentives: [], // Empty array as no incentive slabs are needed
//                     createdAt: new Date()
//                 });

//                 // Save the new payroll criteria
//                 payrollCriteria = [await defaultPayrollCriteria.save()];
//             }

//             return payrollCriteria;
//         } catch (error) {
//             console.error("Error fetching or creating payroll criteria:", error);
//             throw new Error("Failed to fetch or create payroll criteria");
//         }
//     }
// }
