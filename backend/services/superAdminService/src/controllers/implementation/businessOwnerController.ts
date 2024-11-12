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
     console.log("hiting fetch all business owners..");
     
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

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
   
    
        try {
          // Retrieve the refresh token from the cookies
          const refreshToken = req.cookies.refreshToken;
        
    
          // Ensure the refresh token exists
          if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is missing.' });
          }
    
          // Call the service to get the new access token using the refresh token
          const newAccessToken = await this.businessOwnerService.setNewAccessToken(refreshToken);
    
          // Ensure the new access token was successfully generated
          if (!newAccessToken) {
            return res.status(403).json({ message: 'Failed to generate a new access token.' });
          }
    

          res.cookie('accessToken', newAccessToken, {
            httpOnly: true, // This makes the cookie inaccessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Secure cookies in production only
            sameSite: 'strict', // Correct value for SameSite
            maxAge: 1000 * 60 * 15, // Set expiration time (e.g., 15 minutes)
          });
    
          // Return the new access token in the response
          return res.status(200).json({ accessToken: newAccessToken });
    
        } catch (error: unknown) {
          // Handle different error cases
          if (error instanceof Error) {
            console.error("Error occurred:", error.message);
            return res.status(403).json({ message: error.message });
          } else {
            console.error("Unexpected error occurred.");
            return res.status(500).json({ message: 'An unexpected error occurred.' });
          }
        }
      }
    


}