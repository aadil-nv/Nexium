import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import IDepartmentService from "../interface/IDepartmentService";
import { inject, injectable } from "inversify";



@injectable()
export default class DepartmentService implements IDepartmentService {
  constructor(
    @inject("IDepartmentRepository") private _departmentRepository: IDepartmentRepository
  ) {}

  async addDepartments(departmentName: string, employees: any): Promise<any> {
    console.log('"hitting addDepartments service=------------------"'.bgMagenta);
    console.log("departmentName", departmentName);
    console.log("employees********************************************", employees);
    
    
    try {
      const department = await this._departmentRepository.addDepartments(departmentName, employees);
      return department;
    } catch (error) {
      console.error("Error in addDepartments service:", error);
      throw new Error("Failed to add departments");
    }
  }

  async getDepartments(): Promise<any> {
    try {
      const departments = await this._departmentRepository.findAll();
      return departments;
    } catch (error) {
      console.error("Error in getDepartments service:", error);
      throw new Error("Failed to fetch department data");
    }
  }

  async removeEmployee(employeeId: string, departmentId: string): Promise<any> {
    try {
      const department = await this._departmentRepository.findDepartment(departmentId);

      if (!department) {
        throw new Error("Department not found");
      }

      const employeeIndex = department.employees.findIndex((emp: any) => emp.id === employeeId);

      if (employeeIndex === -1) {
        throw new Error("Employee not found in the department");
      }

      department.employees.splice(employeeIndex, 1);

      await this._departmentRepository.updateDepartment(departmentId, { employees: department.employees });

      return { message: "Employee removed successfully", department };
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

      return {
          departmentId: department._id,
          departmentName: department.departmentName,
          employeesAdded: results.map((result) => ({
              employeeId: result.updatedEmployee._id,
              employeeName: result.updatedEmployee.name,
          })),
      };
  } catch (error: any) {
      console.error('Error in service layer (addEmployeesToDepartment):', error.message);
      throw error;
  }
}



 


  
  
      
      

}
