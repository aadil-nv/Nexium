import { Request, Response } from "express";
import { CustomRequest } from "middlewares/authMiddleware";

export default interface IBusinessOwnerController {
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    getPersonalDetails(req:CustomRequest ,res:Response):Promise<Response>
    getCompanyDetails(req:CustomRequest ,res:Response):Promise<Response>
    getAddress(req:CustomRequest ,res:Response):Promise<Response>
    getDocuments(req:CustomRequest ,res:Response):Promise<Response>
    updatePersonalDetails(req:CustomRequest ,res:Response):Promise<Response>
    updateCompanyDetails(req:CustomRequest ,res:Response):Promise<Response>
    uploadImages(req:CustomRequest ,res:Response):Promise<Response>
    uploadLogo(req:CustomRequest ,res:Response):Promise<Response>
    updateAddress(req:CustomRequest ,res:Response):Promise<Response>
    uploadDocuments(req:CustomRequest ,res:Response):Promise<Response>
    addServiceRequest(req:CustomRequest ,res:Response):Promise<Response>
    getAllServiceRequests(req:CustomRequest ,res:Response):Promise<Response>
    updateServiceRequest(req:CustomRequest ,res:Response):Promise<Response>
    updateIsActive(req: CustomRequest, res: Response): Promise<Response>    

}
