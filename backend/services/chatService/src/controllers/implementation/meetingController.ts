import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IMeetingService from "../../service/interface/IMeetingService";
import IMeetingController from "../interface/IMeetingController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enum";


@injectable()
export default class MeetingController implements IMeetingController {
    constructor(@inject("IMeetingService") private _meetingService: IMeetingService) {}
    
    async getAllMeetings(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            const response = await this._meetingService.getAllMeetings(myId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error:any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
            
        }
    }

    private getMyId(req: CustomRequest): string {
        return (
            req.user?.businessOwnerData?._id ||
            req.user?.managerData?._id ||
            req.user?.employeeData?._id ||
            ''
        );
    }
}