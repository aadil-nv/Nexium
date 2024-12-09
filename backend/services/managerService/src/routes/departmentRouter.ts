import { Router } from "express";
import container from "../config/inversify";
import IDepartmentController from "../controllers/interface/IDepartmentController"
import authenticateToken from "../middlewares/tokenAuthenticate";


const departmentRouter = Router();

const departmentController = container.get<IDepartmentController>("IDepartmentController");


departmentRouter.post("/add-departments", (req, res) => departmentController.addDepartments(req, res));
departmentRouter.get('/get-departments',(req, res) => departmentController.getDepartments(req, res))
departmentRouter.patch('/remove-employee',(req,res)=>departmentController.removeEmployee(req,res))
departmentRouter.patch('/update-deparmentname',(req,res)=>departmentController.updateDepartmentName(req,res))
departmentRouter.post('/add-employee',(req,res)=>departmentController.addEmployeeToDepartment(req,res))
departmentRouter.delete('/delete-department', (req, res) => departmentController.deleteDepartment(req, res));

export default departmentRouter