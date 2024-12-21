import { inject , injectable } from "inversify";
import { Request, Response } from "express";    
import ITaskService from "../../service/interface/ITaskService";
import ITaskController from "../../controllers/interface/ITaskController";
import { HttpStatusCode } from "../../utils/enums";
import { CustomRequest } from "../../middlewares/tokenAuth";
import { log } from "node:console";

@injectable()

export default class TaskController implements ITaskController {
    constructor(@inject("ITaskService") private taskService: ITaskService){}

    async getTasks(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const tasks = await this.taskService.getTasks(taskId);
            return res.status(HttpStatusCode.OK).json(tasks);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getEmployeeWithoutTask(req: Request, res: Response): Promise<Response> {
        
        try {
            const employees = await this.taskService.getEmployeeWithoutTask();
            if(!employees) return res.status(HttpStatusCode.OK).json([]);
            
            return res.status(HttpStatusCode.OK).json(employees);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async assignTaskToEmployee(req: Request, res: Response): Promise<Response> {
        try {
            const taskData = req.body;
            console.log(`"taskData from the body "`.bgRed,taskData);
            
            const task = await this.taskService.assignTaskToEmployee(taskData);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getAllTasks(req: Request, res: Response): Promise<Response> {
        
        try {
            const tasks = await this.taskService.getAllTasks();
            
            return res.status(HttpStatusCode.OK).json(tasks);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const taskData = req.body;
            const task = await this.taskService.updateTask(taskId, taskData);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async deleteTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const task = await this.taskService.deleteTask(taskId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getTasksByEmployee(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            
            const tasks = await this.taskService.getTasksByEmployeeId(employeeId as string);
            
            return res.status(HttpStatusCode.OK).json(tasks[0]);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateTaskCompletion(req:CustomRequest , res:Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
          
            console.log(`"employeeId from the body "`.bgRed,employeeId);
            
            const data = req.body;
            console.log(`"taskId from the body "`.bgRed,data);
            const task = await this.taskService.updateTaskCompletion( data,employeeId as string);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}