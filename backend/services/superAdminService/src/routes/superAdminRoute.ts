import {Router} from "express";
import container from "../config/inversify";
import ISuperAdminController from "../controllers/interface/ISuperAdminController";
import authenticateToken from "../middlewares/authMiddleware";


const superAdminRouter = Router();
const superAdminController = container.get<ISuperAdminController>("ISuperAdminController");

superAdminRouter.post("/refresh-token",(req,res,next)=>superAdminController.setNewAccessToken(req,res));
superAdminRouter.post('/logout',authenticateToken,(req,res,next)=>superAdminController.logout(req,res));
superAdminRouter.get('/all-serevice-request',authenticateToken,(req,res,next)=>superAdminController.getAllServiceRequest(req,res));
superAdminRouter.patch('/update-status/:id',authenticateToken, (req, res, next) => superAdminController.updateServiceRequestStatus(req, res,));


export default superAdminRouter;
