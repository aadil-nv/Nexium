import { Request, Response } from "express";
import IEmployeeController from "../interface/IEmployeeController";
import IEmployeeService from "../../service/interface/IEmployeeService";
import { inject, injectable } from "inversify";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enums";

@injectable()
export default class EmployeeController implements IEmployeeController {
  private _employeeService: IEmployeeService;

  constructor(@inject("IEmployeeService") employeeService: IEmployeeService) {
    this._employeeService = employeeService;
  }

  async getProfile(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.user?.updatedEmployee._id;
      await this._employeeService.getProfile(employeeId, businessOwnerId as string); 
      return res.status(HttpStatusCode.OK).json({ message: "Attendance added successfully!" });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }

  async getAllEmployees(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;      
      const employees = await this._employeeService.getAllEmployees(businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(employees);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }


  async addEmployee(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeData = req.body;      
      const employee = await this._employeeService.addEmployee(employeeData, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }


  async blockEmployee(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.params.id;
      const employee = await this._employeeService.blockEmployee(employeeId, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }


  async removeEmployee(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.params.id;
      const employee = await this._employeeService.removeEmployee(employeeId, businessOwnerId as string);
      return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }

  async updatePersonalInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.params.id;
      const employee = await this._employeeService.updatePersonalInfo(employeeId, businessOwnerId as string, req.body);
      return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }

  async updateProfessionalInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.params.id;
      const employee = await this._employeeService.updateProfessionalInfo(employeeId, businessOwnerId as string, req.body);
      return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }

  async updateAddressInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.params.id;
      const employee = await this._employeeService.updateAddressInfo(employeeId, businessOwnerId as string, req.body);
      return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }


  async updateSecurityInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.params.id;
      const employee = await this._employeeService.updateSecurityInfo(employeeId, businessOwnerId as string, req.body);
      return res.status(HttpStatusCode.OK).json(employee);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }


  async uploadProfilePic(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const employeeId = req.params.id;
      const result = await this._employeeService.uploadProfilePic(businessOwnerId as string, employeeId, req.file);
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
  }


}
