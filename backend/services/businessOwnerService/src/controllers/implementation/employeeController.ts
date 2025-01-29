import { Request, Response } from "express";
import IEmployeeController from "../interface/IEmployeeController";
import IEmployeeService from "../../service/interface/IEmployeeService";
import { inject, injectable } from "inversify";
import { CustomRequest } from "../../middlewares/authMiddleware";

@injectable()
export default class EmployeeController implements IEmployeeController {
  private _employeeService: IEmployeeService;

  constructor(@inject("IEmployeeService") employeeService: IEmployeeService) {
    this._employeeService = employeeService;
  }

  async getProfile(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const companyId = req.user?.updatedCompany._id;
      const employeeId = req.user?.updatedEmployee._id;

      await this._employeeService.getProfile(employeeId, companyId);
      return res.status(201).json({ message: "Attendance added successfully!" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
