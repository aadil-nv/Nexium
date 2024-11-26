import { Router } from "express";
import container from "../config/inversify";
import IManagerController from "../controllers/interface/IManagerController"
import authenticateToken from "../middlewares/tokenAuthenticate";
import managerModel from "models/managerModel";


const managerRouter = Router(); 

const managerController = container.get<IManagerController>("IManagerController");


managerRouter.get("/get-managers",authenticateToken, (req, res) => managerController.getManagers(req , res));
managerRouter.get("/get-managerpersonalinfo",authenticateToken, (req, res) => managerController.getManagerPersonalInfo(req , res));
managerRouter.get("/get-managerprofessionalinfo",authenticateToken,(req,res)=>managerController.getManagerProfessionalInfo(req,res))
managerRouter.get("/get-manageraddress",authenticateToken,(req,res)=>managerController.getManagerAddress(req,res))
managerRouter.get("/get-managerdocuments",authenticateToken,(req,res)=>managerController.getManagerDocuments(req,res))
managerRouter.get("/get-managercredentials",authenticateToken,(req,res)=>managerController.getManagerCredentials(req,res))

managerRouter.patch("/update-personalinfo",authenticateToken,(req,res)=>managerController.updateManagerPersonalInfo(req,res))

export default managerRouter