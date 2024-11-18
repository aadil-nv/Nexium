import { inject, injectable } from "inversify";
import IBaseRepository from "../interface/IBaseRepository";
import IDepartmentRepository from "../interface/IDepartmentRepository";
import BaseRepository from "./baseRepository";
import departmentModel from "../../models/departmentModel";
import IDepartment from '../../entities/departmentEntities';
import { Model } from "mongoose";

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
    
    
    

}