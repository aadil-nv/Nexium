import { Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default  interface IMeetingController {
    getAllMeetings(req: CustomRequest, res: Response): Promise<Response>
    createMeeting(req: CustomRequest, res: Response): Promise<Response>
    updateMeeting(req: CustomRequest, res: Response): Promise<Response>
    deleteMeeting(req: CustomRequest, res: Response): Promise<Response>
    getAllParticipants(req: CustomRequest, res: Response): Promise<Response>
}