import container  from "../config/inversify";
import { Router } from "express";
import  tokenAutharaise  from "../middlewares/tokenAuth";
import IPayrollController from "../controllers/interface/IPayrollController";

const employeeController = container.get<IPayrollController>("IPayrollController");


const payrollRouter = Router();

payrollRouter.get("/get-payroll",tokenAutharaise,(req, res)=> employeeController.getPayroll(req, res));

export default payrollRouter