import { Request, Response } from "express";
export default interface IBusinessOwnerController {
    fetchAllBusinessOwners(req:Request,res:Response): Promise<Response >;
    updateIsBlocked(req:Request,res:Response): Promise<Response>;
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
}