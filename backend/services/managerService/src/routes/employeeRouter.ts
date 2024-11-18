import  { Router } from "express";
import container from "../config/inversify";
import IEmployeeController from "../controllers/interface/IEmployeeController"
import authenticateToken from "../middlewares/tokenAuthenticate";


const employeeRouter = Router();

const employeeController = container.get<IEmployeeController>("IEmployeeController");


employeeRouter.post("/add-employees",authenticateToken, (req, res) => employeeController.addEmployees(req , res));
employeeRouter.get("/get-employees" ,authenticateToken,(req, res) => employeeController.getEmployees(req , res))

export default employeeRouter