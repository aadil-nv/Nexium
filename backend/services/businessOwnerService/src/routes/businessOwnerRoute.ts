import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
import authenticateToken from "../middlewares/authMiddleware";

const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")

businessOwnerRouter.post("/add-managers",(req,res,next)=>businessOwnerController.addManagers(req,res));
businessOwnerRouter.get("/fetch-all-managers",(req,res,next)=>businessOwnerController.findAllManagers(req,res));
businessOwnerRouter.get("/all-managers",(req,res,next)=>businessOwnerController.findAllManagers(req,res));
businessOwnerRouter.post('/refresh-token', (req, res, next) => businessOwnerController.setNewAccessToken(req, res));


export default businessOwnerRouter;