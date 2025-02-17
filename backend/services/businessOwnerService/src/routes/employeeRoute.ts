import { Router} from "express";
import IEmployeeController from "../controllers/interface/IEmployeeController";
import container from "../config/inversify";
import authenticateToken from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/multer-s3";
import checkSubscription from "../middlewares/checkSubscription";

const employeeRouter = Router();

const employeeController = container.get<IEmployeeController>("IEmployeeController");

employeeRouter.get("/get-profile",authenticateToken, (req, res ,next) =>employeeController.getProfile(req, res));
employeeRouter.get('/get-all-employees',authenticateToken,(req,res,next) => employeeController.getAllEmployees(req, res))
employeeRouter.post('/add-employee',authenticateToken,checkSubscription("employee"), (req, res, next) => employeeController.addEmployee(req, res))
employeeRouter.patch('/block-employee/:id',authenticateToken, (req, res, next) => employeeController.blockEmployee(req, res))
employeeRouter.patch("/remove-employee/:id",authenticateToken, (req, res, next) => employeeController.removeEmployee(req, res))
employeeRouter.put('/update-personal-info/:id',authenticateToken, (req, res, next) => employeeController.updatePersonalInfo(req, res));
employeeRouter.put('/update-professional-info/:id',authenticateToken, (req, res, next) => employeeController.updateProfessionalInfo(req, res));
employeeRouter.put('/update-address-info/:id',authenticateToken, (req, res, next) => employeeController.updateAddressInfo(req, res));
employeeRouter.put('/update-security-info/:id',authenticateToken, (req, res, next) => employeeController.updateSecurityInfo(req, res));
employeeRouter.post('/update-profile-picture/:id',authenticateToken,uploadMiddleware, (req, res, next) => employeeController.uploadProfilePic(req, res));
employeeRouter.put('/update-leave-info/:id',authenticateToken, (req, res, next) => employeeController.updateEmployeeLeaveInfo(req, res));


export default employeeRouter