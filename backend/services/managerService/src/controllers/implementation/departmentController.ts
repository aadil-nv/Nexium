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
}
