import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IMessageService from "../../service/interface/IMessageService";
import IMessageController from "../interface/IMessageController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enum";


@injectable()
export default class MessageController implements IMessageController {
    constructor(@inject("IMessageService") private _messageService: IMessageService) { }

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

    async getAllMessages(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const chatRoomId = req.params.id;
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._messageService.getAllMessages(chatRoomId, myId, businessOwnerId);

            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error getting messages" });
        }
    }

    async deleteMessage(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const messageId = req.params.id;
            const busineesOwnerId = this.getBusinessOwnerId(req);
            const response = await this._messageService.deleteMessage(messageId, busineesOwnerId);;
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error deleting message" });
        }
    }
}