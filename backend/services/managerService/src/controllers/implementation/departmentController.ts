import { Request, Response } from 'express';
import IDepartmentController from "../interface/IDepartmentController";
import IDepartmentService from "../../service/interface/IDepartmentService";
import { injectable, inject } from "inversify";
import { log } from 'node:console';

@injectable()
export default class DepartmentController implements IDepartmentController {
    constructor(
        @inject("IDepartmentService") private _departmentService: IDepartmentService
    ) {}

    async addDepartments(req: Request, res: Response): Promise<Response> {
        try {
          const { departmentName, employees } = req.body;
      
          // Validate employees input
          if (!Array.isArray(employees)) {
            return res.status(400).json({ 
              message: "Employees must be an array of objects", 
              success: false 
            });
          }
      
          // Call the service layer
          const result = await this._departmentService.addDepartments(departmentName, employees);
      
          // Return the response from the service layer
          if (!result.success) {
            return res.status(400).json(result); 
          }
      
          return res.status(200).json(result);
      
        } catch (error: any) {
          console.error("Error in addDepartments:", error);
      
          return res.status(500).json({
            message: "An unexpected error occurred.",
            success: false,
            error: error.message
          });
        }
      }
      

    async getDepartments(req: Request, res: Response): Promise<void> {
        try {
            const departments = await this._departmentService.getDepartments();
            const datas = departments.map((dep: any) => ({
                employees : dep.employees.employeeId,
                empname : dep.employees.name
            }))
            console.log(`get departments-------------------------------------------------`.bgRed, departments.employees);
            console.log(`get departments-------------------------------------------------`.bgRed, datas);
            
            res.status(200).json(departments);
        } catch (error) {
            console.error("Error fetching departments:", error);
            res.status(500).json({ message: "Failed to get departments" });
        }
    }

    async removeEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId, departmentId } = req.body;
            console.log("req.body", req.body);

            console.log("employeeId##################", employeeId);
            console.log("departmentId##################", departmentId);
            
            
            

            if (!employeeId || !departmentId) {
                res.status(400).json({ message: 'Employee ID and Department ID are required' });
                return;
            }

            await this._departmentService.removeEmployee(employeeId, departmentId);
            res.status(200).json({ message: 'Employee removed successfully from the department' });
        } catch (error) {
            console.error('Error in removeEmployee:', error);
            res.status(500).json({ message: 'An error occurred' });
        }
    }

    async deleteDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { departmentId } = req.body;

            if (!departmentId) {
                res.status(400).json({ message: 'Department ID is required' });
                return;
            }

            await this._departmentService.deleteDepartment(departmentId);
            res.status(200).json({ message: 'Department deleted successfully' });
        } catch (error) {
            console.error('Error in deleteDepartment:', error);
            res.status(500).json({ message: 'An error occurred' });
        }
    }
  

    async updateDepartmentName(req: Request, res: Response): Promise<void> {
        try {
            const { departmentId, newDepartmentName } = req.body;
    
            // Ensure required fields are provided
            if (!departmentId || !newDepartmentName) {
                res.status(400).json({ message: 'Department ID and new department name are required.' });
                return;
            }
    
            // Call service to update department name
            const updatedDepartment = await this._departmentService.updateDepartmentName(departmentId, newDepartmentName);
            
            // Return success response
            res.status(200).json({
                message: 'Department name updated successfully.',
                department: updatedDepartment
            });
            
        } catch (error:any) {
           
                // Generic error handling
                res.status(500).json({ message: 'An error occurred while updating the department name.' });
            
        }
    }
    

    async addEmployeesToDepartment(req: Request, res: Response): Promise<Response> {
        console.log("hitting add employee to department controller");
        
        try {
            const { departmentId, employeeData } = req.body;
           
      

            console.log("req.body", req.body);
           
            
    
            // Validate input
            if (!employeeData) {
                return res.status(400).json({ message: 'Employee ID and Department ID are required.' });
            }
    
            // Call the service layer
            const result = await this._departmentService.addEmployeesToDepartment(employeeData ,departmentId);
    
            return res.status(200).json({ 
                message: 'Employee added to department successfully.', 
                data: result 
            });
        } catch (error: any) {
            console.error('Error adding employee to department:', error.message);
    
            // Return appropriate status codes for different error types
            if (error.message === 'Department not found.') {
                return res.status(404).json({ message: 'Department not found.' });
            }
    
            if (error.message === 'Employee not found.') {
                return res.status(404).json({ message: 'Employee not found.' });
            }
    
            if (error.message === 'Employee is already in the department.') {
                return res.status(400).json({ message: 'Employee is already in the department.' });
            }
    
            // Generic error message for internal server errors
            return res.status(500).json({ message: 'Internal server error.', error: error.message });
        }
    }
    
      

}
