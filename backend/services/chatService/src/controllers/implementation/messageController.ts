import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IMessageService from "../../service/interface/IMessageService";
import IMessageController from "../interface/IMessageController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enum";


@injectable()
export default  class MessageController implements IMessageController {
    constructor(@inject("IMessageService") private _messageService: IMessageService) { }
    async createMessage(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const response = await this._messageService.createMessage(req.body, req.params.id);
            return res.status(HttpStatusCode.CREATED).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error creating message" });
        }

    }
}