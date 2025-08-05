import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import ITaskService from "../../service/interface/ITaskService";
import ITaskController from "../../controllers/interface/ITaskController";
import { HttpStatusCode } from "../../utils/enums";
import { CustomRequest } from "../../middlewares/tokenAuth";

@injectable()

export default class TaskController implements ITaskController {
    constructor(@inject("ITaskService") private taskService: ITaskService) { }

    private getBusinessOwnerId(req: CustomRequest): string {
        return req.user?.employeeData?.businessOwnerId || '';
    }

    async getTasks(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const tasks = await this.taskService.getTasks(taskId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(tasks);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getEmployeesToAddTask(req: CustomRequest, res: Response): Promise<Response> {

        try {
            const teamLeadId = req.user?.employeeData?._id
            const businessOwnerId = this.getBusinessOwnerId(req);
            const employees = await this.taskService.getEmployeesToAddTask(teamLeadId as string, businessOwnerId);
            if (!employees) return res.status(HttpStatusCode.OK).json([]);
            return res.status(HttpStatusCode.OK).json(employees);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async assignTaskToEmployee(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const taskData = req.body;
            const teamLeadId = req.user?.employeeData?._id
            const businessOwnerId = this.getBusinessOwnerId(req);
            const task = await this.taskService.assignTaskToEmployee(taskData, teamLeadId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getAllTasks(req: CustomRequest, res: Response): Promise<Response> {

        try {
            const teamLeadId = req.user?.employeeData?._id
            const businessOwnerId = this.getBusinessOwnerId(req);
            const tasks = await this.taskService.getAllTasks(teamLeadId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(tasks);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const taskData = req.body;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const task = await this.taskService.updateTask(taskId, taskData, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async deleteTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const task = await this.taskService.deleteTask(taskId, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getTasksByEmployeeId(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const taskId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const tasks = await this.taskService.getTasksByEmployeeId(employeeId as string, taskId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(tasks);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateTaskCompletion(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const data = req.body;
            const task = await this.taskService.updateTaskCompletion(data, employeeId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateTaskApproval(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const data = req.body;
            const task = await this.taskService.updateTaskApproval(data, taskId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async getTaskListOfEmployee(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const employeeId = req.user?.employeeData?._id;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const tasks = await this.taskService.getTaskListOfEmployee(employeeId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(tasks);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async updateCompletedTask(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const data = req.body;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const task = await this.taskService.updateCompletedTask(data, taskId as string, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async reassignTask(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const taskData = req.body;
            const businessOwnerId = this.getBusinessOwnerId(req);
            const task = await this.taskService.reassignTask(taskId, taskData, businessOwnerId);
            return res.status(HttpStatusCode.OK).json(task);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });

        }
    }
}