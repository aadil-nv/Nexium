
import { Request, Response } from "express";
export default interface ITaskController {
    getTasks(req: Request, res: Response): Promise<Response>;
    getEmployeeWithoutTask(req: Request, res: Response): Promise<Response>;
    assignTaskToEmployee(req: Request, res: Response): Promise<Response>;
    getAllTasks(req: Request, res: Response): Promise<Response>;
    updateTask(req: Request, res: Response): Promise<Response>;
}