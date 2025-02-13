import {Router} from "express";
import container from "../config/inversify";
import IEmployeeController from "../controllers/interface/IEmployeeController"; // Use interface

const employeeRouter = Router();

const employeeController = container.get<IEmployeeController>("IEmployeeController");

employeeRouter.post("/employee-login", (req, res) => employeeController.employeeLogin(req, res));
employeeRouter.post("/validate-otp", (req, res, next) => employeeController.validateOtp(req, res, next));
employeeRouter.post("/resend-otp", (req, res) => employeeController.resendOtp(req, res));

export default employeeRouter;