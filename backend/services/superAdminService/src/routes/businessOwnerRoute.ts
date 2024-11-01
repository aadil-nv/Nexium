import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
// import authenticateToken from "../middlewares/authMiddleware";

const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")



businessOwnerRouter.get("/fetch-all-businessowners",(req,res,next)=>businessOwnerController.fetchAllBusinessOwners(req,res));


export default businessOwnerRouter;