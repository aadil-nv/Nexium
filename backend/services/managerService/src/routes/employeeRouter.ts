import  e, { Router } from "express";
import container from "../config/inversify";
import IEmployeeController from "../controllers/interface/IEmployeeController"
import authenticateToken from "../middlewares/tokenAuthenticate";
import {uploadMiddleware} from "../middlewares/multer-s3"
import checkSubscription from "../middlewares/checkSubscription";


const employeeRouter = Router();

const employeeController = container.get<IEmployeeController>("IEmployeeController");

employeeRouter.get('/get-employee/:id',authenticateToken, (req, res) => employeeController.getEmployee(req , res));
employeeRouter.get("/get-employees" ,authenticateToken,(req, res) => employeeController.getEmployees(req , res))
employeeRouter.get('/get-documents/:id',authenticateToken,(req,res)=>employeeController.getEmployeeDocuments(req,res))
employeeRouter.get("/get-employee-without-department",authenticateToken,(req, res) => employeeController.getEmployeeWithOutDepartment(req , res))
employeeRouter.get('/get-employeeCredentials/:id',authenticateToken,(req,res)=>employeeController.getEmployeeCredentials(req,res)) 



employeeRouter.post("/add-employees",authenticateToken, (req, res) => employeeController.addEmployees(req , res));
employeeRouter.post('/update-personalinformation/:id',authenticateToken,(req,res)=>employeeController.updateEmployeePersonalInformation(req,res))
employeeRouter.post('/update-address/:id',authenticateToken,(req,res)=>employeeController.updateAddress(req,res))
employeeRouter.post('/update-professionalinformation/:id',authenticateToken,(req,res)=>employeeController.updateEmployeeProfessionalInfo(req,res))
employeeRouter.post('/update-profile-picture/:id',authenticateToken,uploadMiddleware,(req,res)=>employeeController.updateProfilePicture(req,res))
employeeRouter.post('/update-resume/:id',authenticateToken,uploadMiddleware,(req,res)=>employeeController.updateResume(req,res) )
employeeRouter.post('/update-blocking/:id',authenticateToken,(req,res)=>employeeController.updateBlocking(req,res))
employeeRouter.post('/update-credentials/:id',authenticateToken,(req,res)=>employeeController.updateCredentials(req,res))


employeeRouter.delete('/remove-employee/:id',authenticateToken,(req,res)=>employeeController.removeEmployee(req,res))



export default employeeRouter