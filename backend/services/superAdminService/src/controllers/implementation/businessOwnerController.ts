import {Request, Response} from 'express';
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interface/IBusinessOwnerService";
import { inject, injectable } from 'inversify';


@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController {
    
    private businessOwnerService:IBusinessOwnerService;
    constructor(@inject("IBusinessOwnerService") businessOwnerService:IBusinessOwnerService) {
        this.businessOwnerService = businessOwnerService;
    }

    async fetchAllBusinessOwners(req:Request,res:Response):Promise<Response >{
     
        try {
            const businessOwners = await this.businessOwnerService.fetchAllBusinessOwners();
            return res.status(200).json({businessOwners});    

        } catch (error) {
            console.log(error);     
            return res.status(500).json({"message":"Error while fetching managers"});
            
        }
    }

    async updateIsBlocked(req:Request,res:Response):Promise<Response>{
        console.log("hiting update is blocked..");
        const {id} = req.params;
        try {
            const updatedBusinessOwner = await this.businessOwnerService.updateIsBlocked(id);   
            return res.status(200).json({updatedBusinessOwner});

        } catch (error) {
            console.log(error);
            return res.status(500).json({"message":"Error while updating isBlocked"});
            
        }
    }


}