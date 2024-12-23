import {Router} from "express";
import container from "../config/inversify";
import IDashboardController from "../controllers/interface/IDashboardController";
import authenticateToken from "../middlewares/tokenAuthenticate";


const dashboardRouter = Router();
const dashboardController = container.get<IDashboardController>("IDashboardController");

dashboardRouter.get("/dashboard-data",authenticateToken,(req,res,next)=>dashboardController.getAllDashboardData(req,res));



export default dashboardRouter;
