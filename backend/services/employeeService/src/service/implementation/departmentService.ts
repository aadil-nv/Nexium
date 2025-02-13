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
    // Fetch employee data
    const employeeData = await this._employeeRepository.getProfile(employeeId , businessOwnerId);
    console.log("Employee data from service:", employeeData);
    
    if (!employeeData) {
      throw new Error("Employee not found");
    }

    // Extract department ID from employee's professional details
    const departmentId = employeeData.professionalDetails.department;
    if (!departmentId) {
      throw new Error("Department ID not found");
    }

    // Fetch department details with populated employeeId
    const result: IDepartment | null = await this._departmentRepository.getDepartment(departmentId , businessOwnerId);

    // console.log("Result from service department:", result);
    // const empData :result.map((item:any) => item.employees.map((emp : any) => emp.employeeId));

    if (!result) {
      throw new Error("Department not found");
    }

    return {
      departmentId: result._id, // Convert ObjectId to string
      departmentName: result.departmentName,
      employees: result.employees.map((employee) => {
        console.log("Employee from service:", employee);
        
        const emp = employee.employeeId as any; // Ensure it's fully populated
        return {
          employeeId: emp._id.toString(), // Get the actual employeeId
          name: emp.personalDetails?.employeeName || "Unknown", // Access personalDetails safely
          email: emp.employeeCredentials?.companyEmail || "Unknown", // Access employeeCredentials safely
          position: emp.professionalDetails?.position || "Unknown", // Access professionalDetails safely
          profilePicture: emp.personalDetails?.profilePicture
            ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${emp.personalDetails?.profilePicture}`
            : undefined, // Return undefined if profilePicture is null
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

