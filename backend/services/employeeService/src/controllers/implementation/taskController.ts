import { inject , injectable } from "inversify";
import { Request, Response } from "express";    
import ITaskService from "../../service/interface/ITaskService";
import ITaskController from "../../controllers/interface/ITaskController";
import { HttpStatusCode } from "../../utils/enums";
import { CustomRequest } from "../../middlewares/tokenAuth";

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

    async getEmployeesToAddTask(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const teamLeadId = req.user?.employeeData?._id
            const employees = await this.taskService.getEmployeesToAddTask( teamLeadId as string);
            if(!employees) return res.status(HttpStatusCode.OK).json([]);
            
            return res.status(HttpStatusCode.OK).json(employees);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async assignTaskToEmployee(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const taskData = req.body;
            const teamLeadId = req.user?.employeeData?._id
            console.log(`"taskData from the body "`.bgRed,taskData);
            
            const task = await this.taskService.assignTaskToEmployee(taskData ,teamLeadId as string);
                console.log(`"task from the body "`.bgRed,task);
                
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getAllTasks(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const teamLeadId = req.user?.employeeData?._id
            const tasks = await this.taskService.getAllTasks(teamLeadId as string);
            
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

    async getTasksByEmployeeId(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const taskId = req.params.id;
            
            const tasks = await this.taskService.getTasksByEmployeeId(employeeId as string , taskId as string);            
            
            return res.status(HttpStatusCode.OK).json(tasks);
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

    async updateTaskApproval(req:CustomRequest , res:Response): Promise<Response> {
        try {
            const taskId = req.params.id;
          
            console.log(`"taskId from the body "`.bgRed,taskId);
            
            const data = req.body;
            console.log(`"taskId from the body "`.bgRed,data);
            const task = await this.taskService.updateTaskApproval( data,taskId as string);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getTaskListOfEmployee(req:CustomRequest , res:Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const tasks = await this.taskService.getTaskListOfEmployee(employeeId as string);
            console.log("tasks ----------------2323142?>>>>",tasks);
            
            return res.status(HttpStatusCode.OK).json(tasks);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateCompletedTask(req:CustomRequest , res:Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            console.log(`"taskId from the body "`.bgRed,taskId);
            
            const data = req.body;
            console.log(`"taskId from the body "`.bgRed,data);
            
            const task = await this.taskService.updateCompletedTask(data, taskId as string);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async reassignTask(req: CustomRequest, res: Response): Promise<Response> {
        console.log(`"hitting REasssign task employee=============================="`.bgMagenta);
        
        try {
            console.log(`"taskData from the body "`.bgRed,req.body);
            
            const taskId = req.params.id;
            console.log("taskId------------------------",taskId);
            
            const taskData = req.body;
            const task = await this.taskService.reassignTask(taskId, taskData);
            return res.status(HttpStatusCode.OK).json(task);
            
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
            
        }
    }
}