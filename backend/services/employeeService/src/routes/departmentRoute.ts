import container  from "../config/inversify";
import { Router } from "express";
import tokenAutharaise from "../middlewares/tokenAuth";
import IDepartmentController from "../controllers/interface/IDepartmentController";



const departmentRouter = Router();

const departmentController = container.get<IDepartmentController>("IDepartmentController");


departmentRouter.get("/get-mydepartment",tokenAutharaise,(req, res)=> departmentController.getDepartment(req, res));


export default departmentRouter