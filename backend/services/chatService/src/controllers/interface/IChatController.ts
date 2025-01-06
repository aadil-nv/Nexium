import {Request ,Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";


export default interface IChatController {
    createChat(req: CustomRequest, res: Response): Promise<Response>;
    createMessage(req: CustomRequest, res: Response): Promise<Response>;
    getAllReceiver(req: CustomRequest, res: Response): Promise<Response>;
    createGroup(req: CustomRequest, res: Response): Promise<Response>;
    getAllGroups(req: CustomRequest, res: Response): Promise<Response>;



    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
}