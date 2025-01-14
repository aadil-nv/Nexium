import container from "../config/inversify";
import IMeetingController from "../controllers/interface/IMeetingController";
import e, { Router } from "express";
import  authenticateToken  from "../middlewares/authMiddleware";

const meetingRouter = Router();

const meetingController = container.get<IMeetingController>("IMeetingController");


meetingRouter.get('/get-all-meetings',authenticateToken, (req, res ,next) => meetingController.getAllMeetings(req, res));


export default meetingRouter;