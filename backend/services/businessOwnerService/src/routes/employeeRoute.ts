import { Router} from "express";
import IEmployeeController from "../controllers/interface/IEmployeeController";
import container from "../config/inversify";

const employeeRouter = Router();

const employeeController = container.get<IEmployeeController>("IEmployeeController");

employeeRouter.get("/get-profile", (req, res ,next) =>employeeController.getProfile(req, res));

export default employeeRouter