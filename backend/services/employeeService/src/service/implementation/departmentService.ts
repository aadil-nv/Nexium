import {inject,injectable} from "inversify";
import IDepartmentService from "../../service/interface/IDepartmentService";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import { IGetDepartmentDTO } from "../../dto/IDepartmentDTO";
import IDepartment from "../../entities/departmentEntities";
import IEmployeeRepository from "repository/interface/IEmployeeRepository";

@injectable()
export default class DepartmentService implements IDepartmentService {
    constructor(@inject("IDepartmentRepository") 
    private _departmentRepository: IDepartmentRepository,
    @inject("IEmployeeRepository")
    private _employeeRepository:IEmployeeRepository
) {}
    async getDepartment(employeeId: string): Promise<IGetDepartmentDTO> {
        
        try {
            const employeeData= await this._employeeRepository.getProfile(employeeId);
            
            if (!employeeData) throw new Error("Employee not found");
            const departmentId = employeeData.professionalDetails.department
            if(!departmentId) {
                
                return {
                    message:"No department found",
                    success:false
                }
            }



          const result: IDepartment | null = await this._departmentRepository.getDepartment(departmentId);

          if (!result) throw new Error("Department not found");

          return {
            departmentId: result._id.toString(), 
            departmentName: result.departmentName,
            employees: result.employees.map((employee) => ({
              _id: employee._id.toString(), 
              name: employeeData.personalDetails.employeeName,
              email: employeeData.employeeCredentials.companyEmail,
              position: employeeData.professionalDetails.position,
              profilePicture: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeData.personalDetails.profilePicture}`,
              isActive: employeeData.isActive,
            })),
          
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
      
      
      
      
}
