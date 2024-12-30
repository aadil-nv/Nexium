import container  from "../config/inversify";
import { Router } from "express";
import tokenAutharaise from "../middlewares/tokenAuth";
import IAttendanceController from "../controllers/interface/IAttendanceController";

const leaveRouter = Router();

const leaveController = container.get<IAttendanceController>("IAttendanceController");

leaveRouter.post("/apply-leave",tokenAutharaise,(req, res)=> leaveController.applyLeave(req, res));
// leaveRouter.get('/get-approved-leaves',tokenAutharaise,(req, res)=> leaveController.fetchApprovedLeaves(req, res))


export default leaveRouter