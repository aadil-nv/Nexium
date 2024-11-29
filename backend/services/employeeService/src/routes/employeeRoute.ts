import container from "../config/inversify";
import { Router } from "express";
import  IEmployeeController  from "../controllers/interface/IEmployeeController";
import tokenAutharaise from "../middlewares/tokenAuth"


const employeeRouter = Router();

const employeeController = container.get<IEmployeeController>("IEmployeeController");


employeeRouter.post("/refresh-token",(req, res)=> employeeController.setNewAccessToken (req, res));
employeeRouter.get("/get-profile",tokenAutharaise,(req, res)=> employeeController.getProfile (req, res));

export default employeeRouter