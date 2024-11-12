import {Router} from "express";
import container from "../config/inversify";
import ISuperAdminController from "../controllers/interface/ISuperAdminController";
import authenticateToken from "../middlewares/authMiddleware";


const superAdminRouter = Router();
const superAdminController = container.get<ISuperAdminController>("ISuperAdminController");

superAdminRouter.post("/refresh-token",authenticateToken,(req,res,next)=>superAdminController.setNewAccessToken(req,res));
