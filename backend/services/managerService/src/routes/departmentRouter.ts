import { Router } from "express";
import container from "../config/inversify";
import IDepartmentController from "../controllers/interface/IDepartmentController"
import authenticateToken from "../middlewares/tokenAuthenticate";


const departmentRouter = Router();

const departmentController = container.get<IDepartmentController>("IDepartmentController");


departmentRouter.post("/add-departments",authenticateToken, (req, res) => departmentController.addDepartments(req, res));
departmentRouter.get('/get-departments',authenticateToken,(req, res) => departmentController.getDepartments(req, res))
departmentRouter.post('/remove-employee',authenticateToken,(req,res)=>departmentController.removeEmployee(req,res))
departmentRouter.patch('/update-deparmentname',authenticateToken,(req,res)=>departmentController.updateDepartmentName(req,res))
departmentRouter.post('/add-employee',authenticateToken,(req,res)=>departmentController.addEmployeesToDepartment(req,res))
departmentRouter.delete('/delete-department',authenticateToken, (req, res) => departmentController.deleteDepartment(req, res));

export default departmentRouter