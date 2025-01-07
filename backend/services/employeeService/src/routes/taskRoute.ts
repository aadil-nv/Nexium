import container from "../config/inversify";
import { Router } from "express";
import tokenAutharaise from "../middlewares/tokenAuth";
import ITaskController from "../controllers/interface/ITaskController";


const taskRouter = Router();

const taskController = container.get<ITaskController>("ITaskController");


taskRouter.get("/get-tasks/:id",tokenAutharaise,(req, res)=> taskController.getTasks(req, res));
taskRouter.get('/get-employee-without-task',tokenAutharaise,(req, res)=> taskController.getEmployeesToAddTask(req, res));
taskRouter.get('/get-all-tasks',tokenAutharaise,(req, res)=> taskController.getAllTasks(req, res));
taskRouter.get('/get-tasks-by-employee/:id',tokenAutharaise,(req, res)=> taskController.getTasksByEmployeeId(req, res));
taskRouter.get('/employee-tasklist',tokenAutharaise,(req, res)=> taskController.getTaskListOfEmployee(req, res));

taskRouter.post('/assign-task-to-employee',tokenAutharaise,(req, res)=> taskController.assignTaskToEmployee(req, res));
taskRouter.post('/update-task/:id',tokenAutharaise,(req, res)=> taskController.updateTask(req, res));
taskRouter.post('/update-completed-task/:id',tokenAutharaise,(req, res)=> taskController.updateCompletedTask(req, res));
taskRouter.post('/update-task-completion',tokenAutharaise,(req, res)=> taskController.updateTaskCompletion(req, res));



taskRouter.patch('/update-taskapproval/:id',tokenAutharaise,(req, res)=> taskController.updateTaskApproval(req, res));
taskRouter.patch('/reassign-task/:id',tokenAutharaise,(req, res)=> taskController.reassignTask(req, res));

taskRouter.delete('/delete-task/:id',tokenAutharaise,(req, res)=> taskController.deleteTask(req, res));
export default taskRouter