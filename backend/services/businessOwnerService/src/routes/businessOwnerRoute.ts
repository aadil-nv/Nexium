import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
import authenticateToken from "../middlewares/authMiddleware";

const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")

<<<<<<< HEAD
businessOwnerRouter.post("/add-managers",(req,res,next)=>businessOwnerController.addManagers(req,res));

businessOwnerRouter.get("/fetch-all-managers",(req,res,next)=>businessOwnerController.findAllManagers(req,res));
businessOwnerRouter.get("/all-managers",(req,res,next)=>businessOwnerController.findAllManagers(req,res));
=======
businessOwnerRouter.post("/add-managers",authenticateToken,(req,res,next)=>businessOwnerController.addManagers(req,res));

businessOwnerRouter.get("/find-all-managers",authenticateToken,(req,res,next)=>businessOwnerController.findAllManagers(req,res));
>>>>>>> cc3e19bf05b3d09f1064503815fc8de7f3466ed0


export default businessOwnerRouter;