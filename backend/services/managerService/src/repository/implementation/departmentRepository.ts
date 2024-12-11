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

          console.log("1111111111111111111111111111111111111111111111111");
         

          
          
          
  
          if (!Array.isArray(employees) || employees.length === 0) {
              throw new Error('Employees must be a non-empty array');
          }
          console.log("22222222222222222222222222222222222222222222222222");
     
          employees.forEach((emp: any) => {
              if (!emp._id || !emp.name || typeof emp._id !== 'string' || typeof emp.name !== 'string') {
                  console.log(`Invalid employee object: ${JSON.stringify(emp)}`.bgRed);
                  throw new Error(`Invalid employee object: ${JSON.stringify(emp)}`);
              }
              emp.name = emp.name.trim();
          });
          console.log("3333333333333333333333333333333333333333333333333");
      
  
          // Create the department
          const department = await this._departmentModel.create({ departmentName, employees });
          console.log("Department added successfully:", department);
          console.log("44444444444444444444444444444444444444444444444444");
          // Update each employee's departmentId in professionalDetails
          const departmentId = department._id;
          const updatePromises = employees.map((emp) => {
              return employeeModel.findByIdAndUpdate(
                  emp._id, 
                  { 'professionalDetails.department': departmentId }, // Corrected path
                  { new: true }
              );
          });
          await Promise.all(updatePromises);
  
          console.log("Employees updated with departmentId successfully.");
          return department;
      } catch (error) {
          console.error('Error in addDepartments repository:', error);
          throw error;
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
    
    async addEmployeesToDepartment(departmentId: string, employee: any): Promise<any> {
      console.log('"hitting addEmployeeToDepartment repository=------------------"'.bgRed);
      console.log("departmentId--------------------", departmentId);
      console.log("employee----------------------------", employee);
      
      
      try {
          // Find the department by ID
          const department = await this._departmentModel.findById(departmentId);
          console.log("department---------------------------", department);
          
          if (!department) {
              throw new Error('Department not found.');
          }
            console.log("1111111111111111111111111111111111111111111111111");
        
          // Check if the employee is already part of the department
          if (department.employees.some((emp: any) => emp._id === employee._id)) {
              throw new Error(`Employee ${employee.name} is already in the department.`);
          }
          console.log("22222222222222222222222222222222222222222222222222");
     
          
  
          // Add the employee to the department's employee list
          department.employees.push(employee);
          console.log("3333333333333333333333333333333333333333333333333");
       
          // Save the updated department
          await department.save();
          console.log("4444444444444444444444444444444444444444444444444");
  
  
          // Update the employee's department field
          const updatedEmployee = await employeeModel.findByIdAndUpdate(
              employee._id,
              { 'professionalDetails.department': departmentId },
              { new: true }
          );
          console.log("updatedEmployee------------------------", updatedEmployee);
          
  
          if (!updatedEmployee) {
              throw new Error('Employee not found while updating department field.');
          }
  
          console.log("Updated employee's department successfully:", updatedEmployee);
  
          return {
              department,
              updatedEmployee,
          };
      } catch (error:any) {
          console.error('Error in Repository (addEmployeeToDepartment):', error.message);
          throw error;
      }
  }
  
  
  
      
      

}