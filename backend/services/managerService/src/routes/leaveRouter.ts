import container from "../config/inversify";
import { Router } from "express";
import ILeaveController from "../controllers/interface/ILeaveController";
import authenticateToken from "../middlewares/tokenAuthenticate";


const leaveRouter = Router();

const leaveController = container.get<ILeaveController>("ILeaveController");

leaveRouter.patch("/update-leave-approval/:id",authenticateToken, (req, res) => leaveController.updateLeaveApproval(req , res));
leaveRouter.get('/get-all-leave-employees',authenticateToken,(req, res) => leaveController.getAllLeaveEmployees(req, res))
leaveRouter.get('/get-all-leavetypes',authenticateToken,(req, res) => leaveController.getAllLeaveTypes(req, res))
leaveRouter.post('/update-leavetypes/:id',authenticateToken,(req, res) => leaveController.updateLeaveTypes(req, res))

leaveRouter.get('/pre-applied-leaves',authenticateToken,(req,res)=>leaveController.fetchAllPreAppliedLeaves(req, res))
leaveRouter.post('/update-pre-applied-leave/:id',authenticateToken,(req,res)=>leaveController.updatePreAppliedLeaves(req, res))


export default leaveRouter;