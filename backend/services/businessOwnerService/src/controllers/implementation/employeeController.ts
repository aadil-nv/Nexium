import { Request, Response } from "express";
import IEmployeeController from "../interface/IEmployeeController";
import IEmployeeService from "../../service/interface/IEmployeeService";    
import { inject, injectable } from "inversify";

@injectable()
export default class EmployeeController implements IEmployeeController {

    private employeeService: IEmployeeService;

    constructor(@inject("IEmployeeService") employeeService: IEmployeeService) {
        this.employeeService = employeeService;
    }


   async getProfile(req: Request, res: Response):Promise<Response>  {
        try {
            const companyId = (req as any).user?.updatedCompany._id;
            const employeeId = (req as any).user?.updatedEmployee._id;

            await this.employeeService.getProfile(employeeId,companyId );
            return res.status(201).json({ message: "Attendance added successfully!" });
        } catch (error) {
            console.error("Error adding attendance:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}