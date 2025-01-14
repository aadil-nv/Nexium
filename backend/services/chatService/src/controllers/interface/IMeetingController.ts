import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default  interface IMeetingController {
    getAllMeetings(req: CustomRequest, res: Response): Promise<Response>
}