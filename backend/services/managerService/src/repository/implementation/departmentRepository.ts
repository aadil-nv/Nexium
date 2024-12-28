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

    async findAllDepartments(): Promise<IDepartment[]> {
        try {
            return await this._departmentModel.find().populate('employees.employeeId').exec();
        } catch (error) {
            console.error("Error finding departments:", error);
            throw error;
        }
    }

    async addDepartments(departmentName: string, employees: any[]): Promise<any> {
    
      try {
        if (!Array.isArray(employees) || employees.length === 0) {
          throw new Error('Employees must be a non-empty array');
        }
    
        // To collect employees that are already assigned to a department
        const alreadyInDepartment: string[] = [];
    
        // Check each employee if they already belong to a department
        for (let emp of employees) {
          if (!emp.employeeId || !emp.name || typeof emp.employeeId !== 'string' || typeof emp.name !== 'string') {
            console.log(`Invalid employee object: ${JSON.stringify(emp)}`.bgRed);
            throw new Error(`Invalid employee object: ${JSON.stringify(emp)}`);
          }
    
          // Check if the employee is already assigned to a department
          const employee = await employeeModel.findById(emp.employeeId);
    
          if (employee && (employee.professionalDetails.department || '').trim()) {
            alreadyInDepartment.push(emp.name); // Add employee name to the list if they are already in a department
          }
        }
    
        if (alreadyInDepartment.length > 0) {
          throw new Error(`The following employees are already in a department: ${alreadyInDepartment.join(', ')}`);
        }
    
        // If no employees are already assigned, proceed with adding the department
        const department = await this._departmentModel.create({ departmentName, employees });
        const departmentId = department._id;
    
        // Update employee records with the new departmentId
        const updatePromises = employees.map((emp) => {
          return employeeModel.findByIdAndUpdate(
            emp.employeeId,
            { 'professionalDetails.department': departmentId },
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
            // Step 1: Find the department
            const department = await this._departmentModel.findById(departmentId);
            if (!department) {
                throw new Error('Department not found');
            }
    
            // Step 2: Extract employee IDs from the department
            const employeeIds = department.employees.map(emp => emp.employeeId);
    
            // Step 3: Update each employee to remove the department reference
            await employeeModel.updateMany(
                { _id: { $in: employeeIds } },
                { $unset: { 'professionalDetails.department': null } } // Removes the department field
            );
    
            // Step 4: Delete the department
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

      try {
          // Find the department by ID
          const department = await this._departmentModel.findById(departmentId);
   
          
          if (!department) {
              throw new Error('Department not found.');
          }
   
          
          // Check if the employee is already part of the department
          if (department.employees.some((emp: any) => emp.employeeId == employee.employeeId)) {
     
              throw new Error(`Employee ${employee.name} is already in the department.`);
          }

          const employeeData = await employeeModel.findById(employee.employeeId);
          if(!employeeData){
              throw new Error("Employee not found");
          }

     
          const formattedEmployee = {
            employeeId: employeeData?._id,
            name: employeeData?.personalDetails?.employeeName,
            email: employeeData?.employeeCredentials?.companyEmail,
            position: employeeData?.professionalDetails?.position,
            profilePicture: employeeData?.personalDetails?.profilePicture,
            isActive: employeeData?.isActive, // Map `isOnline` to `isActive`
        };
  
          department.employees.push(formattedEmployee);
     
          await department.save();


          const updatedEmployee = await employeeModel.findByIdAndUpdate(
              employee.employeeId,
              { 'professionalDetails.department': departmentId },
              { new: true }
          ); 
  
          if (!updatedEmployee) {
              throw new Error('Employee not found while updating department field.');
          }
  
  
          return {
              department,
              updatedEmployee,
          };
      } catch (error:any) {
          console.error('Error in Repository (addEmployeeToDepartment):', error.message);
          throw error;
      }
  }
  
  async getDepartments(): Promise<IDepartment[]> {
    try {
        const departments = await this._departmentModel.find().populate('employees.employeeId');
        console.log("departments======sdft435sg==================", departments);
        
        return departments;
    } catch (error) {
        console.error('Error in Repository (getDepartments):', error);
        throw error;
    }
  }

  
  async removeEmployeeFromDepartment(departmentId: string, employeeId: string): Promise<any> {

    try {
      const department = await this._departmentModel.findById(departmentId);
      if (!department) {
        throw new Error('Department not found');
      }
  
      const employeeIndex = department.employees.findIndex((emp: any) => emp.employeeId.toString() === employeeId);
      if (employeeIndex === -1) {
        throw new Error('Employee not found in the department');
      }
  
      department.employees.splice(employeeIndex, 1);
      await department.save();
  
      // Update the employee's department to null
      const employee = await employeeModel.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
  
      employee.professionalDetails.department = null ; 
      await employee.save();
  
      return { message: 'Employee removed from department and updated successfully' };
    } catch (error: any) {
      console.error('Error in Repository (removeEmployeeFromDepartment):', error.message);
      throw error;
    }
  }
  
  
      
      

}