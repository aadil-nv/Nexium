
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
export default interface ITaskController {
    getTasks(req: Request, res: Response): Promise<Response>;
    getEmployeeWithoutTask(req: Request, res: Response): Promise<Response>;
    assignTaskToEmployee(req: Request, res: Response): Promise<Response>;
    getAllTasks(req: Request, res: Response): Promise<Response>;
    updateTask(req: Request, res: Response): Promise<Response>;
    deleteTask(req: Request, res: Response): Promise<Response>;
    getTasksByEmployee(req: CustomRequest, res: Response): Promise<Response>;
    updateTaskCompletion(req:CustomRequest , res:Response):Promise<Response>
}