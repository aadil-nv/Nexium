import container from "../config/inversify";
import { Router } from "express";
import tokenAutharaise from "../middlewares/tokenAuth";
import ITaskController from "../controllers/interface/ITaskController";


const taskRouter = Router();

const taskController = container.get<ITaskController>("ITaskController");


taskRouter.get("/get-tasks/:id",tokenAutharaise,(req, res)=> taskController.getTasks(req, res));
taskRouter.get('/get-employee-without-task',tokenAutharaise,(req, res)=> taskController.getEmployeeWithoutTask(req, res));
taskRouter.get('/get-all-tasks',tokenAutharaise,(req, res)=> taskController.getAllTasks(req, res));

taskRouter.post('/assign-task-to-employee',tokenAutharaise,(req, res)=> taskController.assignTaskToEmployee(req, res));
taskRouter.post('/update-task/:id',tokenAutharaise,(req, res)=> taskController.updateTask(req, res));
export default taskRouter