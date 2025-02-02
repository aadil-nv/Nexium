import { Router } from "express";
import container from "../config/inversify";
import IManagerController from "../controllers/interface/IManagerController"
import authenticateToken from "../middlewares/tokenAuthenticate";
import {uploadMiddleware} from "../middlewares/multer-s3"


const managerRouter = Router(); 

const managerController = container.get<IManagerController>("IManagerController");


managerRouter.get("/get-managers",authenticateToken, (req, res) => managerController.getManagers(req , res));
managerRouter.get("/get-managerpersonalinfo",authenticateToken, (req, res) => managerController.getManagerPersonalInfo(req , res));
managerRouter.get("/get-managerprofessionalinfo",authenticateToken,(req,res)=>managerController.getManagerProfessionalInfo(req,res))
managerRouter.get("/get-manageraddress",authenticateToken,(req,res)=>managerController.getManagerAddress(req,res))
managerRouter.get("/get-managerdocuments",authenticateToken,(req,res)=>managerController.getManagerDocuments(req,res))
managerRouter.get("/get-managercredentials",authenticateToken,(req,res)=>managerController.getManagerCredentials(req,res))
managerRouter.get('/get-leave-employees',authenticateToken,(req,res)=>managerController.getLeaveEmployees(req,res))

managerRouter.post('/refresh-token',(req, res, next) => managerController.setNewAccessToken(req, res));
managerRouter.post('/logout', (req, res) => managerController.logout(req, res));
managerRouter.post("/update-isactive",authenticateToken,(req, res) => managerController.updateManagerIsActive(req , res));

managerRouter.patch("/update-personalinfo",authenticateToken,(req,res)=>managerController.updateManagerPersonalInfo(req,res))
managerRouter.patch('/update-profile-picture',authenticateToken,uploadMiddleware,(req,res)=>managerController.updateManagerProfilePicture(req,res))
managerRouter.patch('/update-address',authenticateToken,(req,res)=>managerController.updateManagerAddress(req,res))
managerRouter.post('/update-documents',authenticateToken,uploadMiddleware,(req,res)=>managerController.updateDocuments(req,res))



export default managerRouter