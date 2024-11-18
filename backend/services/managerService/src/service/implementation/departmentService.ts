import IDepartmentRepository from "../../repository/interface/IDepartmentRepository";
import IDepartmentService from "../interface/IDepartmentService";
import { inject, injectable } from "inversify";

@injectable()
export default class DepartmentService implements IDepartmentService {
  constructor(
    @inject("IDepartmentRepository") private _departmentRepository: IDepartmentRepository
  ) {}

  async addDepartments(departmentName: string, employees: any): Promise<any> {
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
}
