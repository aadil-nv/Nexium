import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IChatService from "../../service/interface/IChatService";
import IChatController from "../interface/IChatController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enum";

@injectable()
export default class ChatController implements IChatController {
    constructor(@inject("IChatService") private _chatService: IChatService) { }

    private getMyId(req: CustomRequest): string {
        return (
            req.user?.businessOwnerData?._id ||
            req.user?.managerData?._id ||
            req.user?.employeeData?._id ||
            ''
        );
    }

    private getBusinessOwnerId(req: CustomRequest): string {
        return req.user?.businessOwnerData?._id ||
            req.user?.managerData?.businessOwnerId ||
            req.user?.employeeData?.businessOwnerId || '';
    }
    
    async getAllReceiver(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            const response = await this._chatService.getAllReceiver(myId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error getting receivers", error });
        }
    }

    async getAllGroups(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            const response = await this._chatService.getAllGroups(myId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error getting groups", error });
        }
    }

    async getAllPrivateChats(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);

            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            const response = await this._chatService.getAllPrivateChats(myId, businessOwnerId);

            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error getting chats", error });
        }
    }

    async createChat(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const receiverId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.createChat(myId, receiverId, businessOwnerId);
            return res.status(HttpStatusCode.CREATED).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error creating chat", error });
        }
    }
    async createMessage(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.createMessage(req.body, myId, businessOwnerId);
            return res.status(HttpStatusCode.CREATED).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error creating message", error });
        }
    }

    async createGroup(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.createGroup(req.body, myId, businessOwnerId);
            return res.status(HttpStatusCode.CREATED).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error creating group", error });
        }
    }

    async getAllGroupMembers(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const groupId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.getAllGroupMembers(groupId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error getting group members", error });
        }
    }

    async getGroupDetails(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const groupId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.getGroupDetails(groupId, businessOwnerId);;
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error getting group details", error });
        }
    }

    async getAllUnAddedUsers(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const groupId = req.params.id;
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.getAllUnAddedUsers(groupId, myId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error: any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async updateGroup(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const groupId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.updateGroup(groupId, req.body, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error updating group", error });
        }
    }

    async deleteGroup(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const groupId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.deleteGroup(groupId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error deleting group", error });
        }
    }

    async getChatParticipants(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const chatId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._chatService.getChatParticipants(chatId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error getting chat participants", error });
        }
    }

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
            const { refreshToken } = req.cookies || {};
            const response = await this._chatService.setNewAccessToken(refreshToken);
            if (!response.accessToken) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Failed to generate new access token." });
            }
            res.cookie('accessToken', response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: Number(process.env.MAX_AGE),
                sameSite: 'strict',
            });
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error generating access token", error });
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(HttpStatusCode.OK).json({ message: "Logout successful" });
        } catch {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error logging out" });
        }
    }

    async updateLastSeen(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            const response = await this._chatService.updateLastSeen(myId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error updating last seen", error });
        }
    }


}
