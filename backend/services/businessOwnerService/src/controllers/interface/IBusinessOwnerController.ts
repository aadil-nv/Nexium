import { Request, Response } from "express";

export default interface IBusinessOwnerController {
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    getPersonalDetails(req:Request ,res:Response):Promise<Response>
    getCompanyDetails(req:Request ,res:Response):Promise<Response>
    getAddress(req:Request ,res:Response):Promise<Response>
    getDocuments(req:Request ,res:Response):Promise<Response>
    updatePersonalDetails(req:Request ,res:Response):Promise<Response>
    uploadImages(req:Request ,res:Response):Promise<Response>
}
