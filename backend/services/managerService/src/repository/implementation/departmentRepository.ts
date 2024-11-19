import { inject, injectable } from "inversify";
import IBaseRepository from "../interface/IBaseRepository";
import IDepartmentRepository from "../interface/IDepartmentRepository";
import BaseRepository from "./baseRepository";
import departmentModel from "../../models/departmentModel";
import IDepartment from '../../entities/departmentEntities';
import { Model } from "mongoose";
import employeeModel from "../../models/employeeModel"

@injectable()
export default class DepartmentRepository extends BaseRepository<any> implements IDepartmentRepository {

    constructor(@inject("DepartmentModel") private _departmentModel: Model <IDepartment>) {
        super(departmentModel);
    }

    async addDepartments(departmentName: string, employees: any[]): Promise<any> {
        console.log('"hitting addDepartments repository=------------------"'.bgRed);
        try {
            console.log(`departmentName is ${departmentName}`.bgGreen);
            console.log(`employees is ${JSON.stringify(employees)}`.bgGreen);
            
            // Validate that employees is an array of objects
            if (!Array.isArray(employees) || employees.length === 0) {
                throw new Error('Employees must be a non-empty array');
            }
    
            // Validate each employee object has the expected structure
            employees.forEach((emp: any) => {
                if (!emp.id || !emp.name || typeof emp.id !== 'string' || typeof emp.name !== 'string') {
                    console.log(`Invalid employee object: ${JSON.stringify(emp)}`.bgRed);
                    throw new Error(`Invalid employee object: ${JSON.stringify(emp)}`);
                }
                // Trim whitespace from name fields 
                emp.name = emp.name.trim();
            });
    
            // Now create the department with the employees
            const department = await this._departmentModel.create({ departmentName, employees });
    
            console.log("Department added successfully:", department);
            return department;
        } catch (error) {
            console.error('Error in addDepartments repository:', error);
            throw error; // Rethrow to ensure caller is aware of the error
        }
    }
    
    async findDepartment(departmentId: string): Promise<any> {
        try {
          return await this._departmentModel.findById(departmentId); // Use your ORM/Database query
        } catch (error) {
          console.error('Error in Repository (findDepartment):', error);
          throw error;
        }
      }
      
      // Update a department by ID
      async updateDepartment(departmentId: string, updateData: any): Promise<any> {
        try {
          return await this._departmentModel.findByIdAndUpdate(departmentId, updateData, { new: true });
        } catch (error) {
          console.error('Error in Repository (updateDepartment):', error);
          throw error;
        }
      }

      async deleteDepartment(departmentId: string): Promise<any> {
        try {
          return await this._departmentModel.findByIdAndDelete(departmentId);
        } catch (error) {
          console.error('Error in Repository (deleteDepartment):', error);
          throw error;
        }
      }
    

    
      async saveDepartment(department: any): Promise<any> {
        try {
          const updatedDepartment = await this._departmentModel.findByIdAndUpdate(
            department._id, // Assuming the `department` object has an `_id` field
            { departmentName: department.departmentName }, // Pass only the fields to update
            { new: true } // Return the updated document
          );
      
          return updatedDepartment; // Return the updated department
        } catch (error:any) {
          throw new Error(`Failed to save department: ${error.message}`);
        }
      }


      async findEmployee(employeeId: string): Promise<any> {
        try {
            return await employeeModel.findById(employeeId);
        } catch (error) {
            console.error('Error in Repository (findEmployee):', error);
            throw error;
        }
    }
    
      
    async addEmployeeToDepartment(departmentId: string, employee: any): Promise<any> {
      try {
          const department = await this._departmentModel.findById(departmentId);
          if (!department) {
              throw new Error('Department not found.');
          }
  
          // Check if the employee is already part of the department
          if (department.employees.some((emp: any) => emp.id === employee.id)) {
              throw new Error('Employee is already in the department.');
          }
  
          // Add the employee to the department
          department.employees.push(employee);
  
          // Save the updated department
          await department.save();
  
          return department;
      } catch (error) {
          console.error('Error in Repository (addEmployeeToDepartment):', error);
          throw error;
      }
  }
  
      
      

}