import {inject,injectable} from "inversify";
import IDepartmentService from "../../service/interface/IDepartmentService";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import { DepartmentWithEmployeesDTO} from "../../dto/IDepartmentDTO";
import IDepartment from "../../entities/departmentEntities";
import IEmployeeRepository from "repository/interface/IEmployeeRepository";

@injectable()
export default class DepartmentService implements IDepartmentService {
    constructor(@inject("IDepartmentRepository") 
    private _departmentRepository: IDepartmentRepository,
    @inject("IEmployeeRepository")
    private _employeeRepository:IEmployeeRepository
) {}
async getDepartment(employeeId: string , businessOwnerId: string): Promise<DepartmentWithEmployeesDTO> {
  try {
    const employeeData = await this._employeeRepository.getProfile(employeeId , businessOwnerId);
    console.log("Employee data from service:", employeeData);
    
    if (!employeeData) {
      throw new Error("Employee not found");
    }

    const departmentId = employeeData.professionalDetails.department;
    if (!departmentId) {
      throw new Error("Department ID not found");
    }

    const result: IDepartment | null = await this._departmentRepository.getDepartment(departmentId , businessOwnerId);

    if (!result) {
      throw new Error("Department not found");
    }

    return {
      departmentId: result._id, 
      departmentName: result.departmentName,
      employees: result.employees.map((employee) => {
        console.log("Employee from service:", employee);
        
        const emp = employee.employeeId as any; 
        return {
          employeeId: emp._id.toString(), 
          name: emp.personalDetails?.employeeName || "Unknown", 
          email: emp.employeeCredentials?.companyEmail || "Unknown", 
          position: emp.professionalDetails?.position || "Unknown", 
          profilePicture: emp.personalDetails?.profilePicture
            ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${emp.personalDetails?.profilePicture}`
            : undefined, 
          isActive:emp?.isActive,
        };
      }),
    };
  } catch (error) {
    console.error("Error in getDepartment service:", error);
    throw error;
  }
}



      
      
      
}

