import { Request, Response } from "express";
import IEmployeeService from "../../service/interface/IEmployeeService";
import IEmployeeController from "../interface/IEmployeeController";
import { inject, injectable } from "inversify";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import { HttpStatusCode } from "./../../utils/enums";

@injectable()
export default class EmployeeController implements IEmployeeController {
    constructor(
        @inject("IEmployeeService") private _employeeService: IEmployeeService
    ) {}

    async addEmployees(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { employeedata } = req.body;
            const managerData= req?.user?.managerData;
            const businessOwnerId = managerData?.businessOwnerId;
            const result = await this._employeeService.addEmployees(employeedata, managerData ,businessOwnerId as string);
          
            if (result.success) {
                res.status(HttpStatusCode.OK).json({ message: 'Employee added successfully', data: result.data });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: result.message });
            }
        } catch (error) {
            console.error('Error in addEmployees controller:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error });
        }
    }

    async getEmployees(req: CustomRequest, res: Response): Promise<void> {
        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const employeesData = await this._employeeService.getEmployees(businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(employeesData);
        } catch (error) {
            console.error("Error fetching employees:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employees", error });
        }
    }

    async getEmployeeCredentials(req: CustomRequest, res: Response): Promise<void> {
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const result = await this._employeeService.getEmployeeCredentials(employeeId,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching employee credentials:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employee credentials", error });
        }
    }

    async getEmployeeDocuments(req: CustomRequest, res: Response): Promise<void> {
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const result = await this._employeeService.getEmployeeDocuments(employeeId ,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching employee documents:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employee documents", error });
        }
    }

    async getEmployee(req: CustomRequest, res: Response): Promise<void>{
        
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const result = await this._employeeService.getEmployee(employeeId ,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching employee:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employee", error });
        }
    }

    async updateEmployeePersonalInformation(req: CustomRequest, res: Response): Promise<void> {
      
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const personalInformation = req.body;            
     
            const result = await this._employeeService.updateEmployeePersonalInformation(employeeId ,personalInformation,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching employee information:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employee information", error });
        }
    }

    async updateAddress(req: CustomRequest, res: Response): Promise<void> {  
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;

            const address = req.body;
            const result = await this._employeeService.updateAddress(employeeId ,address,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching employee address:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employee address", error });
        }
    }

    async updateEmployeeProfessionalInfo(req: CustomRequest, res: Response): Promise<void> {
                
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const professionalInfo = req.body;
            const result = await this._employeeService.updateEmployeeProfessionalInfo(employeeId ,professionalInfo ,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error fetching employee professional information:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employee professional information", error });
        }
    }

  

    async updateProfilePicture(req: CustomRequest, res: Response): Promise<void> {
    
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;

            const result = await this._employeeService.updateProfilePicture(employeeId, req.file as Express.Multer.File ,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error updating profile picture:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update profile picture", error });
        }
    }

    async updateResume(req: CustomRequest, res: Response): Promise<void> {
        
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const result = await this._employeeService.updateResume(employeeId, req.file as Express.Multer.File,businessOwnerId as string);
           
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error updating resume:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update resume", error });
        }
    }


    async updateBlocking(req: CustomRequest, res: Response): Promise<void> {
        
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            const blocking = req.body;
           
            const result = await this._employeeService.updateBlocking(employeeId ,blocking ,businessOwnerId as string);
            
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error updating blocking:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update blocking", error });
        }
    }


    async getEmployeeWithOutDepartment(req: CustomRequest, res: Response): Promise<void> {
        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId;

            const employeesData = await this._employeeService.getEmployeeWithOutDepartment(businessOwnerId as string);
            
            res.status(HttpStatusCode.OK).json(employeesData);
        } catch (error) {
            console.error("Error fetching employees without department:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to get employees without department", error });
        }
    }

    async removeEmployee(req: CustomRequest, res: Response): Promise<void> {
        try {
            const employeeId = req.params.id;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;

            const result = await this._employeeService.removeEmployee(employeeId ,businessOwnerId as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error removing employee:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to remove employee", error });
        }
    }

    async updateCredentials(req: CustomRequest, res: Response): Promise<void> {
        try {
            const employeeId = req.params.id;
            const credentials = req.body;
            const businessOwnerId = req.user?.managerData?.businessOwnerId;
            
            const result = await this._employeeService.updateCredentials(employeeId, credentials ,businessOwnerId as string);

            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error("Error updating credentials:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update credentials", error });
        }
    }

}
