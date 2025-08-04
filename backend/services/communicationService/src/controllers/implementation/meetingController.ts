import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IMeetingService from "../../service/interface/IMeetingService";
import IMeetingController from "../interface/IMeetingController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enum";
import { log } from "util";


@injectable()
export default class MeetingController implements IMeetingController {
    constructor(@inject("IMeetingService") private _meetingService: IMeetingService) {}
    

    private getMyId(req: CustomRequest): string {
        return (
            req.user?.businessOwnerData?._id ||
            req.user?.managerData?._id ||
            req.user?.employeeData?._id ||
            ''
        );
    }

    private getBusinessOwnerId(req: CustomRequest): string {
        return (
            req.user?.businessOwnerData?._id ||
            req.user?.managerData?.businessOwnerId ||
            req.user?.employeeData?.businessOwnerId ||
            ''
        );
    }
    async getAllMeetings(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });

            const response = await this._meetingService.getAllMeetings(myId , businessOwnerId);
            
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error:any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
            
        }
    }

    async createMeeting(req: CustomRequest, res: Response): Promise<Response> {
                
        try {
            const myId = this.getMyId(req);            
            const businessOwnerId = this.getBusinessOwnerId(req);   
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            const response = await this._meetingService.createMeeting(req.body, myId ,businessOwnerId);
            return res.status(HttpStatusCode.CREATED).json(response);
        } catch (error:any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async updateMeeting(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const meetingId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._meetingService.updateMeeting(meetingId, req.body ,businessOwnerId);            
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error:any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        } 
    }

    async deleteMeeting(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const meetingId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const response = await this._meetingService.deleteMeeting(meetingId , businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error:any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async getAllParticipants(req: CustomRequest, res: Response): Promise<Response> {
        try{
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            if (!myId) return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            const response = await this._meetingService.getAllParticipants(myId , businessOwnerId);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error:any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
    

  
}