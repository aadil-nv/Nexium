import container from "../config/inversify";
import IMeetingController from "../controllers/interface/IMeetingController";
import e, { Router } from "express";
import  authenticateToken  from "../middlewares/authMiddleware";

const meetingRouter = Router();

const meetingController = container.get<IMeetingController>("IMeetingController");

meetingRouter.get('/get-all-participants',authenticateToken, (req, res ,next) => meetingController.getAllParticipants(req, res));
meetingRouter.get('/get-all-meetings',authenticateToken, (req, res ,next) => meetingController.getAllMeetings(req, res));
meetingRouter.post('/create-meeting',authenticateToken, (req, res ,next) => meetingController.createMeeting(req, res));
meetingRouter.patch('/update-meeting/:id',authenticateToken, (req, res ,next) => meetingController.updateMeeting(req, res));
meetingRouter.delete('/delete-meeting/:id',authenticateToken, (req, res ,next) => meetingController.deleteMeeting(req, res));


export default meetingRouter;