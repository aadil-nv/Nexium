import { Request, Response } from "express";
import IEmployeeService from "../../service/interface/IEmployeeService";
import IEmployeeController from "../interface/IEmployeeController";
import { inject, injectable } from "inversify";

@injectable()
export default class EmployeeController implements IEmployeeController {
    constructor(
        @inject("IEmployeeService") private _employeeService: IEmployeeService
    ) {}

    async addEmployees(req: Request, res: Response): Promise<void> {
        try {
            const { employeedata } = req.body;
            const refreshToken = req.cookies.refreshToken;

            const result = await this._employeeService.addEmployees(employeedata, refreshToken);

            if (result.success) {
                res.status(200).json({ message: 'Employee added successfully', data: result.data });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            console.error('Error in addEmployees controller:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async getEmployees(req: Request, res: Response): Promise<void> {
        try {
            const employeesData = await this._employeeService.getEmployees();
            res.status(200).json(employeesData);
        } catch (error) {
            console.error("Error fetching employees:", error);
            res.status(500).json({ message: "Failed to get employees", error });
        }
    }
}
