import { Request, Response } from 'express';
import IDepartmentController from "../interface/IDepartmentController";
import IDepartmentService from "../../service/interface/IDepartmentService";
import { injectable, inject } from "inversify";

@injectable()
export default class DepartmentController implements IDepartmentController {
    constructor(
        @inject("IDepartmentService") private _departmentService: IDepartmentService
    ) {}

    async addDepartments(req: Request, res: Response): Promise<void> {
        try {
            const { departmentName, employees } = req.body;

            if (!Array.isArray(employees)) {
                res.status(400).json({ message: 'Employees must be an array of objects' });
                return;
            }

            const result = await this._departmentService.addDepartments(departmentName, employees);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in addDepartments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getDepartments(req: Request, res: Response): Promise<void> {
        try {
            const departments = await this._departmentService.getDepartments();
            res.status(200).json(departments);
        } catch (error) {
            console.error("Error fetching departments:", error);
            res.status(500).json({ message: "Failed to get departments" });
        }
    }

    async removeEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId, departmentId } = req.body;

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
    

    async addEmployeeToDepartment(req: Request, res: Response): Promise<Response> {
        try {
            const { employeeId, departmentId } = req.body;
    
            // Validate input
            if (!employeeId || !departmentId) {
                return res.status(400).json({ message: 'Employee ID and Department ID are required.' });
            }
    
            // Call the service layer
            const result = await this._departmentService.addEmployeeToDepartment(employeeId, departmentId);
    
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
