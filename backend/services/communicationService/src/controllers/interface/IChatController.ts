import {Request ,Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";


export default interface IChatController {
    createChat(req: CustomRequest, res: Response): Promise<Response>;
    createMessage(req: CustomRequest, res: Response): Promise<Response>;
    getAllReceiver(req: CustomRequest, res: Response): Promise<Response>;
    createGroup(req: CustomRequest, res: Response): Promise<Response>;
    getAllGroups(req: CustomRequest, res: Response): Promise<Response>;
    getAllPrivateChats(req: CustomRequest, res: Response): Promise<Response>;
    getAllGroupMembers(req: CustomRequest, res: Response): Promise<Response>;
    getGroupDetails(req: CustomRequest, res: Response): Promise<Response>;
    getAllUnAddedUsers(req: CustomRequest, res: Response): Promise<Response>;
    updateGroup(req: CustomRequest, res: Response): Promise<Response>;
    deleteGroup(req: CustomRequest, res: Response): Promise<Response>;
    getChatParticipants(req: CustomRequest, res: Response): Promise<Response>;
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    updateLastSeen(req: CustomRequest, res: Response): Promise<Response>;
}