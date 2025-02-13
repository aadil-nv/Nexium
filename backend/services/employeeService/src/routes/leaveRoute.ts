import container  from "../config/inversify";
import { Router } from "express";
import tokenAutharaise from "../middlewares/tokenAuth";
import ILeaveController from "../controllers/interface/ILeaveController";

const leaveRouter = Router();

const leaveController = container.get<ILeaveController>("ILeaveController");

leaveRouter.post("/pre-apply-leave",tokenAutharaise,(req, res)=> leaveController.applyLeave(req, res));
leaveRouter.get('/get-applied-leaves',tokenAutharaise,(req, res)=> leaveController.fetchAppliedLeaves(req, res))
leaveRouter.post('/update-applied-leave/:id',tokenAutharaise,(req, res)=> leaveController.updateAppliedLeave(req, res));
leaveRouter.delete('/delete-applied-leave/:id',tokenAutharaise,(req, res)=> leaveController.deleteAppliedLeave(req, res));


export default leaveRouter