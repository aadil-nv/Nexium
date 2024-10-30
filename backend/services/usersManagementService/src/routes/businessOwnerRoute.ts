import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
import authenticateToken from "../middlewares/authMiddleware";

const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")

businessOwnerRouter.post("/add-managers",authenticateToken,(req,res,next)=>businessOwnerController.addManagers(req,res));

businessOwnerRouter.get("/find-all-managers",authenticateToken,(req,res,next)=>businessOwnerController.findAllManagers(req,res));


export default businessOwnerRouter;