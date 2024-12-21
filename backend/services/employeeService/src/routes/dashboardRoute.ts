import container  from "../config/inversify";
import { Router } from "express";
import tokenAutharaise from "../middlewares/tokenAuth";
import IDashboardController from "../controllers/interface/IDashboardController";

const dashboardRouter = Router();

const dashboardController = container.get<IDashboardController>("IDashboardController");


dashboardRouter.get("/get-all-dashboard-data",tokenAutharaise,(req, res)=> dashboardController.getAllEmployeesCount(req, res));


export default dashboardRouter