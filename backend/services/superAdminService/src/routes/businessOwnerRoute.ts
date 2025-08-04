import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
import authenticateToken from "../middlewares/authMiddleware";

const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")



// businessOwnerRouter.get("/fetch-all-businessowners",authenticateToken,(req,res,next)=>businessOwnerController.fetchAllBusinessOwners(req,res));
businessOwnerRouter.get("/find-all-companies",authenticateToken,(req,res,next)=>businessOwnerController.fetchAllBusinessOwners(req,res));

businessOwnerRouter.get("/find-all-companies",authenticateToken,(req,res,next)=>businessOwnerController.fetchAllBusinessOwners(req,res));
businessOwnerRouter.patch('/update-isblocked/:id', (req, res, next) => businessOwnerController.updateIsBlocked(req, res,));

businessOwnerRouter.post('/refresh-token', (req, res) => businessOwnerController.setNewAccessToken(req, res));



export default businessOwnerRouter;