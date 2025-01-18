import {Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default interface IMessageController {
    // createMessage(req: CustomRequest, res: Response): Promise<Response>;
    getAllMessages(req: CustomRequest, res: Response): Promise<Response>;
    deleteMessage(req: CustomRequest, res: Response): Promise<Response>;
}