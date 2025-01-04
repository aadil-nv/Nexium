import {Request ,Response } from "express";


export default interface IChatController {
    createChat(req: Request, res: Response): Promise<Response>;
    getAllReceiver(req: Request, res: Response): Promise<Response>;
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
}