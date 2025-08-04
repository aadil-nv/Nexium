import { Response } from 'express';
import IDepartmentController from "../interface/IDepartmentController";
import IDepartmentService from "../../service/interface/IDepartmentService";
import { injectable, inject } from "inversify";
import { CustomRequest } from 'middlewares/tokenAuthenticate';
import {HttpStatusCode} from "../../utils/enums"


@injectable()
export default class DepartmentController implements IDepartmentController {
    constructor(
        @inject("IDepartmentService") private _departmentService: IDepartmentService
    ) {}

    async addDepartments(req: CustomRequest, res: Response): Promise<Response> {
        try {
          const { departmentName, employees } = req.body;
          const businessOwnerId = req.user?.managerData?.businessOwnerId;
      
          if (!Array.isArray(employees)) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 
              message: "Employees must be an array of objects", 
              success: false 
            });
          }
      
          const result = await this._departmentService.addDepartments(departmentName, employees,businessOwnerId as string);
      
          if (!result.success) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(result); 
          }
      
          return res.status(HttpStatusCode.OK).json(result);
      
        } catch (error: any) {
          console.error("Error in addDepartments:", error);
      
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error occurred.",
            success: false,
            error: error.message
          });
        }
      }
      

    async getDepartments(req: CustomRequest, res: Response): Promise<void> {
        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const departments = await this._departmentService.getDepartments(businessOwnerId as string);
            const datas = departments.map((dep: any) => ({
                employees : dep.employees.employeeId,
                empname : dep.employees.name
            }))
            
            res.status(HttpStatusCode.OK).json(departments);
        } catch (error) {
            console.error("Error fetching departments:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get departments" });
        }
    }

    async removeEmployee(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { employeeId, departmentId } = req.body;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;

            if (!employeeId || !departmentId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Employee ID and Department ID are required' });
                return;
            }

            await this._departmentService.removeEmployee(employeeId, departmentId ,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json({ message: 'Employee removed successfully from the department' });
        } catch (error) {
            console.error('Error in removeEmployee:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred' });
        }
    }

    async deleteDepartment(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { departmentId } = req.body;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;

            if (!departmentId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Department ID is required' });
                return;
            }

            await this._departmentService.deleteDepartment(departmentId ,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json({ message: 'Department deleted successfully' });
        } catch (error) {
            console.error('Error in deleteDepartment:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred' });
        }
    }
  

    async updateDepartmentName(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { newDepartmentName } = req.body;
            const departmentId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
    
            if (!departmentId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Department ID is required." });
                return;
            }
    
            if (!newDepartmentName) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: "New department name is required." });
                return;
            }
    
            if (!businessOwnerId) {
                res.status(403).json({ message: "Unauthorized. Business owner ID is missing." });
                return;
            }
    
            const updatedDepartment = await this._departmentService.updateDepartmentName(departmentId, newDepartmentName, businessOwnerId as string);
    
            res.status(HttpStatusCode.OK).json({
                message: "Department name updated successfully.",
                department: updatedDepartment
            });
    
        } catch (error: any) {
            console.error("Error in updateDepartmentName controller:", error.message);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || "Internal server error" });
        }
    }
    
    

    async addEmployeesToDepartment(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const { departmentId, employeeData } = req.body;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
           
      
            if (!employeeData) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Employee ID and Department ID are required.' });
            }
    
            const result = await this._departmentService.addEmployeesToDepartment(employeeData ,departmentId ,businessOwnerId as string); ;
    
            return res.status(HttpStatusCode.OK).json({ 
                message: 'Employee added to department successfully.', 
                data: result 
            });
        } catch (error: any) {
            console.error('Error adding employee to department:', error.message);
    
            if (error.message === 'Department not found.') {
                return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Department not found.' });
            }
    
            if (error.message === 'Employee not found.') {
                return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Employee not found.' });
            }
    
            if (error.message === 'Employee is already in the department.') {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Employee is already in the department.' });
            }
    
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.', error: error.message });
        }
    }
    
      

}
