import { Request, Response } from "express";
import IEmployeeService from "../../service/interface/IEmployeeService";
import IEmployeeController from "../interface/IEmployeeController";
import { inject, injectable } from "inversify";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";

@injectable()
export default class EmployeeController implements IEmployeeController {
    constructor(
        @inject("IEmployeeService") private _employeeService: IEmployeeService
    ) {}

    async addEmployees(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { employeedata } = req.body;
            const managerData= req?.user?.managerData;

            

            const result = await this._employeeService.addEmployees(employeedata, managerData);
          

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

    async updateEmployeePersonalInformation(req: CustomRequest, res: Response): Promise<void> {
      
    
        try {
            const employeeId = req.params.id;
         
            const personalInformation = req.body;
     
            const result = await this._employeeService.updateEmployeePersonalInformation(employeeId ,personalInformation);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching employee information:", error);
            res.status(500).json({ message: "Failed to get employee information", error });
        }
    }

    async updateAddress(req: CustomRequest, res: Response): Promise<void> {

        
        try {
            const employeeId = req.params.id;
            
            const address = req.body;
            const result = await this._employeeService.updateAddress(employeeId ,address);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching employee address:", error);
            res.status(500).json({ message: "Failed to get employee address", error });
        }
    }

    async updateEmployeeProfessionalInfo(req: CustomRequest, res: Response): Promise<void> {
        console.log("hitting update employee professional info==================");
        
        console.log("req.body", req.body);
        
        try {
            const employeeId = req.params.id;
            console.log("employeeId--------------------------", employeeId);
            
            const professionalInfo = req.body;
            const result = await this._employeeService.updateEmployeeProfessionalInfo(employeeId ,professionalInfo);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching employee professional information:", error);
            res.status(500).json({ message: "Failed to get employee professional information", error });
        }
    }

    async getEmployeeCredentials(req: CustomRequest, res: Response): Promise<void> {
        try {
            const employeeId = req.params.id;
            const result = await this._employeeService.getEmployeeCredentials(employeeId);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching employee credentials:", error);
            res.status(500).json({ message: "Failed to get employee credentials", error });
        }
    }

    async getEmployeeDocuments(req: CustomRequest, res: Response): Promise<void> {
        try {
            const employeeId = req.params.id;
            const result = await this._employeeService.getEmployeeDocuments(employeeId);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching employee documents:", error);
            res.status(500).json({ message: "Failed to get employee documents", error });
        }
    }

    async getEmployee(req: CustomRequest, res: Response): Promise<void>{
        console.log(`get employee controleris ======`.bgYellow);
        
        try {
            const employeeId = req.params.id;
            console.log("employee id--------------------", employeeId);
            
            const result = await this._employeeService.getEmployee(employeeId);
         
            
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching employee:", error);
            res.status(500).json({ message: "Failed to get employee", error });
        }
    }

}
