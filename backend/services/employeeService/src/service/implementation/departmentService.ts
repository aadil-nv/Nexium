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
async getDepartment(employeeId: string): Promise<DepartmentWithEmployeesDTO> {
  try {
    // Fetch employee data
    const employeeData = await this._employeeRepository.getProfile(employeeId);

    if (!employeeData) {
      throw new Error("Employee not found");
    }

    // Extract department ID from employee's professional details
    const departmentId = employeeData.professionalDetails.department;
    if (!departmentId) {
      throw new Error("Department ID not found");
    }

    // Fetch department details using department ID
    const result: IDepartment | null = await this._departmentRepository.getDepartment(departmentId);

    console.log("Result from service department:", result);

    if (!result) {
      throw new Error("Department not found");
    }

    // Map department data to DTO
    return {
      departmentId: result._id, // Ensure it's returned as a string
      departmentName: result.departmentName,
      employees: result.employees.map((employee) => ({
        employeeId: employee.employeeId.toString(), // Map _id to employeeId
        name: employee.name,
        email: employee.email,
        position: employee.position,
        profilePicture: employee.profilePicture
          ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.profilePicture}`
          : undefined, // Return undefined if profilePicture is null
        isActive: employee.isActive,
      })),
    };
  } catch (error) {
    console.error("Error in getDepartment service:", error);
    throw error;
  }
}


      
      
      
}

