import { DepartmentWithEmployeesDTO } from "dto/IDepartmentDTO";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import IDepartmentService from "../interface/IDepartmentService";
import { inject, injectable } from "inversify";
import { profile } from "node:console";



@injectable()
export default class DepartmentService implements IDepartmentService {
  constructor(
    @inject("IDepartmentRepository") private _departmentRepository: IDepartmentRepository
  ) {}

  async addDepartments(departmentName: string, employees: any): Promise<any> {
    console.log(`"departmentName=================="`.bgRed, employees);
  
    try {
      // Fetch all existing departments
      const departments = await this._departmentRepository.findAllDepartments();
  
      // Check if the department name already exists
      const existingDepartment = departments.find(
        (department: any) => department.departmentName.toLowerCase() === departmentName.toLowerCase()
      );
  
      if (existingDepartment) {
        return { 
          message: `The department name "${departmentName}" already exists. Please choose a different name.`, 
          success: false 
        };
      }
  
      // Validate "Team Lead" position in employees
      const teamLeads = employees.filter((employee: any) => employee.position === "Team Lead");
  
      if (teamLeads.length === 0) {
        return { 
          message: "Please add at least one Team Lead to the department.", 
          success: false 
        };
      }
  
      if (teamLeads.length > 1) {
        return { 
          message: "A department can have only one Team Lead.", 
          success: false 
        };
      }
  
      // Add the department if validation passes
      const department = await this._departmentRepository.addDepartments(departmentName, employees);
  
      console.log("Department added successfully:", department);
  
      return { 
        message: "Department added successfully.", 
        success: true, 
        department 
      };
    } catch (error: any) {
      console.error("Error in addDepartments service:", error.message);
  
      return { 
        message: "Failed to add departments due to an internal error.", 
        success: false,
        error: error.message
      };
    }
  }
  
  async getDepartments(): Promise<DepartmentWithEmployeesDTO[]> {
    try {
        const departments = await this._departmentRepository.getDepartments();
        console.log("departments========================", departments);
        

        const departmentDTOs: DepartmentWithEmployeesDTO[] = departments.map((department: any) => ({
            departmentId: department._id.toString(),
            departmentName: department.departmentName,
            employees: department.employees.map((employee: any) => ({
                employeeId: employee.employeeId._id,
                name: employee.employeeId.personalDetails.employeeName,
                email: employee.employeeId.employeeCredentials.companyEmail,
                position: employee.employeeId.professionalDetails.position,
                profilePicture:employee.employeeId.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.employeeId.personalDetails.profilePicture}` : employee.employeeId.personalDetails.profilePicture,
                isActive: employee.employeeId.isActive,
            })),
        }));

        console.log(`"departmentDTOs====================="`.bgGreen, departmentDTOs);
        
        return departmentDTOs;
    } catch (error) {
        console.error("Error in getDepartments service:", error);
        throw new Error("Failed to fetch department data");
    }
}


  async removeEmployee(employeeId: string, departmentId: string): Promise<any> {
    try {
     const result = await this._departmentRepository.removeEmployeeFromDepartment(departmentId, employeeId);
    } catch (error: any) {
      console.error("Error in removeEmployee service:", error.message);
      throw error;
    }
  }

  async deleteDepartment(departmentId: string): Promise<any> {
    console.log("departmentId%%%%%%%%%%%%%%%%%%%%%%%%", departmentId);
    
    try {
      const department = await this._departmentRepository.findDepartment(departmentId);

      if (!department) {
        throw new Error("Department not found");
      }

      await this._departmentRepository.deleteDepartment(departmentId);

      return { message: "Department deleted successfully", department };
    } catch (error: any) {
      console.error("Error in deleteDepartment service:", error.message);
      throw error;
    }
  }

  async updateDepartmentName(departmentId: string, newDepartmentName: string): Promise<any> {
    try {
        // Validation: Ensure the new department name is not empty and has at least 3 characters
        if (!newDepartmentName || newDepartmentName.length < 3) {
            throw new Error("Department name must be at least 3 characters long and cannot be empty");
        }

        // Retrieve department using repository
        const department = await this._departmentRepository.findDepartment(departmentId);

        if (!department) {
            throw new Error("Department not found");
        }

        // Update the department name
        department.departmentName = newDepartmentName;

        // Save the updated department
        return await this._departmentRepository.saveDepartment(department);

          // Return the updated department
    } catch (error: any) {
      console.error("Error in removeEmployee service:", error.message);
      throw error;
    }
}

async addEmployeesToDepartment(employeeData: any[], departmentId: string): Promise<any> {

  try {
      // Fetch the department
      const department = await this._departmentRepository.findDepartment(departmentId);
      if (!department) {
          throw new Error('Department not found.');
      } 

      // Process each employee
      const results = [];
      for (const employee of employeeData) {
          const updatedInfo = await this._departmentRepository.addEmployeesToDepartment(departmentId, employee);
          results.push(updatedInfo);
      }

      console.log("results====3456fvc256326=====================", department );
      

      return {
          departmentId: department._id,
          departmentName: department.departmentName,
          employeesAdded: results.map((result) => ({
              employeeId: result.updatedEmployee._id,
              employeeName: result.updatedEmployee.personalDetails.employeeName,
              email: result.updatedEmployee.employeeCredentials.companyEmail,
              profilePicture: result.updatedEmployee.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.updatedEmployee.personalDetails.profilePicture}` : result.updatedEmployee.personalDetails.profilePicture
          })),
      };
  } catch (error: any) {
      console.error('Error in service layer (addEmployeesToDepartment):', error.message);
      throw error;
  }
}
  
      

}
