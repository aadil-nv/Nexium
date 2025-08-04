import { DepartmentWithEmployeesDTO } from "dto/IDepartmentDTO";
import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import IDepartmentService from "../interface/IDepartmentService";
import { inject, injectable } from "inversify";
import connectDB from "../../config/connectDB";


@injectable()
export default class DepartmentService implements IDepartmentService {
  constructor(
    @inject("IDepartmentRepository") private _departmentRepository: IDepartmentRepository
  ) {}

  async addDepartments(departmentName: string, employees: any ,businessOwnerId:string): Promise<any> {
  
    try {
      const departments = await this._departmentRepository.findAllDepartments(businessOwnerId);
  
      const existingDepartment = departments.find(
        (department: any) => department.departmentName.toLowerCase() === departmentName.toLowerCase()
      );
  
      if (existingDepartment) {
        return { 
          message: `The department name "${departmentName}" already exists. Please choose a different name.`, 
          success: false 
        };
      }
  
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
  
      const department = await this._departmentRepository.addDepartments(departmentName, employees ,businessOwnerId);
  
  
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
  
  async getDepartments(businessOwnerId: string): Promise<DepartmentWithEmployeesDTO[]> {
    try {
        
        const departments = await this._departmentRepository.getDepartments(businessOwnerId);
        
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

        
        return departmentDTOs;
    } catch (error) {
        console.error("Error in getDepartments service:", error);
        throw new Error("Failed to fetch department data");
    }
}


  async removeEmployee(employeeId: string, departmentId: string ,businessOwnerId:string): Promise<any> {
    try {
     const result = await this._departmentRepository.removeEmployeeFromDepartment(departmentId, employeeId ,businessOwnerId);
    } catch (error: any) {
      console.error("Error in removeEmployee service:", error.message);
      throw error;
    }
  }

  async deleteDepartment(departmentId: string,businessOwnerId:string): Promise<any> {
    
    try {
      const department = await this._departmentRepository.findDepartment(departmentId ,businessOwnerId);

      if (!department) {
        throw new Error("Department not found");
      }

      await this._departmentRepository.deleteDepartment(departmentId ,businessOwnerId);

      return { message: "Department deleted successfully", department };
    } catch (error: any) {
      console.error("Error in deleteDepartment service:", error.message);
      throw error;
    }
  }

  async updateDepartmentName(departmentId: string, newDepartmentName: string, businessOwnerId: string): Promise<any> {
    try {
        if (!newDepartmentName || newDepartmentName.trim().length < 3) {
            throw new Error("Department name must be at least 3 characters long and cannot be empty.");
        }

        if (!businessOwnerId) {
            throw new Error("Business owner ID is required.");
        }

        const departments = await this._departmentRepository.findAllDepartments(businessOwnerId);


        const existingDepartment = departments.find(
            (department: any) => department.departmentName.toLowerCase() === newDepartmentName.toLowerCase()
        );


        if (existingDepartment) {
            throw new Error(`The department name "${newDepartmentName}" already exists. Please choose a different name.`);
        }

        const department = await this._departmentRepository.findDepartment(departmentId, businessOwnerId);

        if (!department) {
            throw new Error("Department not found.");
        }

        department.departmentName = newDepartmentName;

        return await this._departmentRepository.saveDepartment(department, businessOwnerId);

    } catch (error: any) {
        console.error("Error in updateDepartmentName service:", error.message);
        throw new Error(error.message || "An unexpected error occurred while updating department name.");
    }
}


async addEmployeesToDepartment(employeeData: any[], departmentId: string ,businessOwnerId:string): Promise<any> {

  try {
      const department = await this._departmentRepository.findDepartment(departmentId ,businessOwnerId);
      if (!department) {
          throw new Error('Department not found.');
      } 

      const results = [];
      for (const employee of employeeData) {
          const updatedInfo = await this._departmentRepository.addEmployeesToDepartment(departmentId, employee ,businessOwnerId);
          results.push(updatedInfo);
      }
      

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
