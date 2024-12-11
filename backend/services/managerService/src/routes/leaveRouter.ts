import container from "../config/inversify";
import { Router } from "express";
import ILeaveController from "../controllers/interface/ILeaveController";
import authenticateToken from "../middlewares/tokenAuthenticate";


const leaveRouter = Router();

const leaveController = container.get<ILeaveController>("ILeaveController");

leaveRouter.patch("/update-leave-approval/:id",authenticateToken, (req, res) => leaveController.updateLeaveApproval(req , res));
leaveRouter.get('/get-all-leave-employees',authenticateToken,(req, res) => leaveController.getAllLeaveEmployees(req, res))


export default leaveRouter;