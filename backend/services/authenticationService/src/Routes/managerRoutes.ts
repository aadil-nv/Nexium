import { Router } from "express";
import container from "../config/inversify";
import IManagerController from "../controllers/interface/IManagerController"


const managerRouter = Router(); 

const managerController = container.get<IManagerController>("IManagerController");


managerRouter.post("/manager-login", (req, res) => managerController.managerLogin(req , res));
managerRouter.post("/validate-otp", (req, res, next) => managerController.validateOtp(req, res, next));


export default managerRouter