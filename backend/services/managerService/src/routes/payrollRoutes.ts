import container from "../config/inversify";
import { Router } from "express";
import IPayrollController from "../controllers/interface/IPayrollController";
import authenticateToken from "../middlewares/tokenAuthenticate";


const payrollRouter = Router();

const payrollController = container.get<IPayrollController>("IPayrollController");

payrollRouter.get('/get-all-payroll-crieteria',authenticateToken,(req, res) => payrollController.getAllPayrollCriteria(req, res))
payrollRouter.post('/update-payroll-crieteria/:id',authenticateToken,(req, res) => payrollController.updatePayrollCriteria(req, res))
payrollRouter.patch('/delete-incentive/:id',authenticateToken,(req, res) => payrollController.deleteIncentive(req, res))


export default payrollRouter;