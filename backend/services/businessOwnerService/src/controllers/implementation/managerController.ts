import { Request, Response } from "express";
import IManagerController from "../interface/IManagerController";
import IManagerService from "service/interface/IManagerService";
import { inject, injectable } from "inversify";
import { CustomRequest } from "../../middlewares/authMiddleware";

@injectable()
export default class ManagerController implements IManagerController {
  constructor(@inject("IManagerService") private _managerService: IManagerService) {}

  async addManagers(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const { body: managerData, user } = req;
      const businessOwnerId = user?.businessOwnerData?._id;
      const response = await this._managerService.addManagers(businessOwnerId as string, managerData);
      return res.status(200).json(response);
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";
      return res.status(error.name === "ValidationError" ? 400 : 500).json({ error: errorMessage });
    }
  }

  async getAllManagers(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const managers = await this._managerService.getAllManagers(businessOwnerId as string);
      return res.status(200).json(managers);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async blockManager(req: CustomRequest, res: Response): Promise<Response> {
    console.log("hitting block manager==========================");
    console.log(req.body);
  
    try {
      const { body: managerData, user } = req;
      const businessOwnerId = user?.businessOwnerData?._id;
  
      if (!businessOwnerId) {
        return res.status(400).json({ error: "Business Owner ID is missing. Please log in again." });
      }
  
      const response = await this._managerService.blockManager(businessOwnerId as string, managerData);
      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Controller Error in blockManager:", error);
  
      const statusCode = 
        error.name === "ValidationError" ? 400 : 
        error.name === "DatabaseError" ? 500 : 
        500;
  
      const errorMessage =
        error.name === "ValidationError"
          ? error.message
          : "An unexpected error occurred. Please try again later.";
  
      return res.status(statusCode).json({ error: errorMessage });
    }
  }

  async getManager(req: CustomRequest, res: Response): Promise<Response> {
    
    try {
      
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const managerId = req.params.id;
      const manager = await this._managerService.getManager( businessOwnerId as string ,managerId as string);
      if(!manager){
        return res.status(404).json({ error: "Manager not found" });
      }
      
      return res.status(200).json(manager);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updatePersonalInfo(req: CustomRequest, res: Response): Promise<Response> {
    console.log("Controller: getManager =========================");

    try {
      const { body: managerData, user } = req;
      console.log("managerData==========================", managerData);
      
      
      const businessOwnerId = user?.businessOwnerData?._id;
      console.log("businessOwnerId==========================", businessOwnerId);
      
      const managerId = req.params.id;
      console.log("################################",req.params.id);
      const response = await this._managerService.updatePersonalInfo(businessOwnerId as string, managerId as string, managerData);
      if(!response){
        return res.status(404).json({ error: "Manager not found" });
      }
      console.log("response==========================", response);
      
      return res.status(200).json(response);
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";
      return res.status(error.name === "ValidationError" ? 400 : 500).json({ error: errorMessage });
    }
  }

  async updateProfessionalInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const { body: managerData, user } = req;
      const businessOwnerId = user?.businessOwnerData?._id;
      const managerId = req.params.id;
      const response = await this._managerService.updateProfessionalInfo(businessOwnerId as string, managerId as string, managerData);
      if(!response){
        return res.status(404).json({ error: "Manager not found" });
      }
      return res.status(200).json(response);
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";
      return res.status(error.name === "ValidationError" ? 400 : 500).json({ error: errorMessage });
    }
  }

  async updateAddressInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const { body: managerData, user } = req;
      const businessOwnerId = user?.businessOwnerData?._id;
      const managerId = req.params.id;
      const response = await this._managerService.updateAddressInfo(businessOwnerId as string, managerId as string, managerData);
      if(!response){
        return res.status(404).json({ error: "Manager not found" });
      }
      return res.status(200).json(response);
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";
      return res.status(error.name === "ValidationError" ? 400 : 500).json({ error: errorMessage });
    }
  }

  async uploadProfilePic(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const managerId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const response = await this._managerService.uploadProfilePic(businessOwnerId as string, managerId as string, req.file);
      if(!response){
        return res.status(404).json({ error: "Manager not found" });
      }
      return res.status(200).json(response);
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";
      return res.status(error.name === "ValidationError" ? 400 : 500).json({ error: errorMessage });
    }
  } 

  async updateResume(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const managerId = req.params.id;

      const response = await this._managerService.updateResume(
        businessOwnerId as string,
        managerId as string,
        req.file
      );
  
      if (!response) {
        console.log("Manager not found");
        return res.status(404).json({ error: "Manager not found" });
      }
      return res.status(200).json(response);
  
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  
}
