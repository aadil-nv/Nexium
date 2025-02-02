import container from "../config/inversify";
import { Router } from "express";
import  IEmployeeController  from "../controllers/interface/IEmployeeController";
import tokenAutharaise from "../middlewares/tokenAuth"
import { uploadMiddleware } from "../middlewares/multer-s3";


const employeeRouter = Router();

const employeeController = container.get<IEmployeeController>("IEmployeeController");


employeeRouter.post("/refresh-token",(req, res)=> employeeController.setNewAccessToken (req, res));
employeeRouter.post("/logout",tokenAutharaise,(req, res)=> employeeController.logout (req, res));
employeeRouter.post("/update-isactive",tokenAutharaise,(req, res)=> employeeController.updateIsActive(req, res));

employeeRouter.get("/get-profile",tokenAutharaise,(req, res)=> employeeController.getProfile (req, res));
employeeRouter.get('/get-personalinfo',tokenAutharaise,(req, res)=> employeeController.getPersonalInfo(req, res));
employeeRouter.get('/get-address',tokenAutharaise,(req, res)=> employeeController.getAddress(req, res));
employeeRouter.get('/get-employeeprofessionalinfo',tokenAutharaise,(req, res)=> employeeController.getEmployeeProfessionalInfo(req, res));
employeeRouter.get('/get-documents',tokenAutharaise,(req, res)=> employeeController.getDocuments(req, res));
employeeRouter.get('/get-employeecredentials',tokenAutharaise,(req, res)=> employeeController.getEmployeeCredentials(req, res));

employeeRouter.patch("/update-personalinfo",tokenAutharaise,(req, res)=> employeeController.updateProfile(req, res));
employeeRouter.patch('/update-profilepicture',tokenAutharaise,uploadMiddleware,(req, res)=> employeeController.updateProfilePicture(req, res));
employeeRouter.patch('/update-address',tokenAutharaise,(req, res)=> employeeController.updateAddress(req, res));
employeeRouter.patch('/update-documents',tokenAutharaise,uploadMiddleware,(req, res)=> employeeController.updateDocuments(req, res));

export default employeeRouter