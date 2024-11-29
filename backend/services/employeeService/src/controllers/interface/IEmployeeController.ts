import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
export default interface IEmployeeController {
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    getProfile(req: CustomRequest, res: Response): Promise<Response>;
}