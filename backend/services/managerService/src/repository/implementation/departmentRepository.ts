import { inject, injectable } from "inversify";
import IDepartmentRepository from "../interface/IDepartmentRepository";
import BaseRepository from "./baseRepository";
import departmentModel from "../../models/departmentModel";
import IDepartment from '../../entities/departmentEntities';
import { Model } from "mongoose";
import employeeModel from "../../models/employeeModel"
import connectDB from "../../config/connectDB";
import IEmployee from "entities/employeeEntities";


@injectable()
export default class DepartmentRepository extends BaseRepository<any> implements IDepartmentRepository {

    constructor(@inject("DepartmentModel") private _departmentModel: Model <IDepartment>) {
        super(departmentModel);
    }

    async findAllDepartments(businessOwnerId: string): Promise<IDepartment[]> {
      try {
          const db = await connectDB(businessOwnerId);
          
          if (!db.models.Employee) {
              db.model<IEmployee>('Employee', employeeModel.schema);
          }
  
          return await db.model<IDepartment>('Department', departmentModel.schema)
              .find()
              .populate('employees.employeeId')
              .exec();
      } catch (error) {
          console.error("Error finding departments:", error);
          throw error;
      }
  }
  

  async addDepartments(departmentName: string, employees: any[],businessOwnerId:string): Promise<any> {
    
      try {
        const db=await connectDB(businessOwnerId);

        if (!Array.isArray(employees) || employees.length === 0) {
          throw new Error('Employees must be a non-empty array');
        }
    
        const alreadyInDepartment: string[] = [];
    
        for (let emp of employees) {
          if (!emp.employeeId || !emp.name || typeof emp.employeeId !== 'string' || typeof emp.name !== 'string') {
            console.log(`Invalid employee object: ${JSON.stringify(emp)}`.bgRed);
            throw new Error(`Invalid employee object: ${JSON.stringify(emp)}`);
          }
    
          const employee = await db.model("Employee", employeeModel.schema).findById(emp.employeeId);
    
          if (employee && (employee.professionalDetails.department || '').trim()) {
            alreadyInDepartment.push(emp.name); 
          }
        }
    
        if (alreadyInDepartment.length > 0) {
          throw new Error(`The following employees are already in a department: ${alreadyInDepartment.join(', ')}`);
        }
    
        const department = await  db.model<IDepartment>("Department", departmentModel.schema).create({ departmentName, employees });
        const departmentId = department._id;
    
        // Update employee records with the new departmentId
        const updatePromises = employees.map((emp) => {
          return db.model("Employee", employeeModel.schema).findByIdAndUpdate(
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
    
  
  async findDepartment(departmentId: string,businessOwnerId:string): Promise<any> {
        try {
          const db = await connectDB(businessOwnerId);
          return await  db.model<IDepartment>("Department", departmentModel.schema).findById(departmentId); // Use your ORM/Database query
        } catch (error) {
          console.error('Error in Repository (findDepartment):', error);
          throw error;
        }
  }
      
  async updateDepartment(departmentId: string, updateData: any,businessOwnerId:string): Promise<any> {
        try {
          const db = await connectDB(businessOwnerId);
          return await  db.model<IDepartment>("Department", departmentModel.schema).findByIdAndUpdate(departmentId, updateData, { new: true });
        } catch (error) {
          console.error('Error in Repository (updateDepartment):', error);
          throw error;
        }
  }

  async deleteDepartment(departmentId: string,businessOwnerId:string): Promise<any> {
        try {
            const db = await connectDB(businessOwnerId);
            const department = await  db.model<IDepartment>("Department", departmentModel.schema).findById(departmentId);
            if (!department) {
                throw new Error('Department not found');
            }
    
            // Step 2: Extract employee IDs from the department
            const employeeIds = department.employees.map(emp => emp.employeeId);
    
            // Step 3: Update each employee to remove the department reference
            await db.model("Employee", employeeModel.schema).updateMany(
                { _id: { $in: employeeIds } },
                { $unset: { 'professionalDetails.department': null } } // Removes the department field
            );
    
            // Step 4: Delete the department
            return await  db.model<IDepartment>("Department", departmentModel.schema).findByIdAndDelete(departmentId);
        } catch (error) {
            console.error('Error in Repository (deleteDepartment):', error);
            throw error;
        }
  }
    

    
  async saveDepartment(department: any,businessOwnerId:string): Promise<any> {
        try {
          const db = await connectDB(businessOwnerId);
          const updatedDepartment = await  db.model<IDepartment>("Department", departmentModel.schema).findByIdAndUpdate(
            department._id, // Assuming the `department` object has an `_id` field
            { departmentName: department.departmentName }, // Pass only the fields to update
            { new: true } // Return the updated document
          );
      
          return updatedDepartment; // Return the updated department
        } catch (error:any) {
          throw new Error(`Failed to save department: ${error.message}`);
        }
  }


  async findEmployee(employeeId: string,businessOwnerId:string): Promise<any> {
        try {
          const db = await connectDB(businessOwnerId);
            return await db.model("Employee", employeeModel.schema).findById(employeeId);
        } catch (error) {
            console.error('Error in Repository (findEmployee):', error);
            throw error;
        }
  }
    
  async addEmployeesToDepartment(departmentId: string, employee: any,businessOwnerId:string): Promise<any> {

      try {
          const db = await connectDB(businessOwnerId);
          const department = await  db.model<IDepartment>("Department", departmentModel.schema).findById(departmentId);
   
          
          if (!department) {
              throw new Error('Department not found.');
          }
   
          
          // Check if the employee is already part of the department
          if (department.employees.some((emp: any) => emp.employeeId == employee.employeeId)) {
     
              throw new Error(`Employee ${employee.name} is already in the department.`);
          }

          const employeeData = await db.model("Employee", employeeModel.schema).findById(employee.employeeId);
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


          const updatedEmployee = await db.model("Employee", employeeModel.schema).findByIdAndUpdate(
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
  
  async getDepartments(businessOwnerId: string): Promise<IDepartment[]> {
    try {
        const db = await connectDB(businessOwnerId);

        const DepartmentModel = db.model<IDepartment>("Department", departmentModel.schema);
        const EmployeeModel = db.model("Employee", employeeModel.schema);

        const departments = await DepartmentModel.find()
            .populate({
                path: "employees.employeeId",
                model: EmployeeModel,
            })
            .lean() 
            .exec();

        return departments as IDepartment[]; // Explicitly cast to IDepartment[]
    } catch (error) {
        console.error("Error in Repository (getDepartments):", error);
        throw error;
    }
  }

  
  async removeEmployeeFromDepartment(departmentId: string, employeeId: string,businessOwnerId:string): Promise<any> {

    try {
      const db = await connectDB(businessOwnerId);
      const department = await  db.model<IDepartment>("Department", departmentModel.schema).findById(departmentId);
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
      const employee = await db.model("Employee", employeeModel.schema).findById(employeeId);
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