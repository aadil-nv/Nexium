
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
export default interface ITaskController {
    getTasks(req: Request, res: Response): Promise<Response>;
    getEmployeesToAddTask(req: CustomRequest, res: Response): Promise<Response>;
    assignTaskToEmployee(req: CustomRequest, res: Response): Promise<Response>;
    getAllTasks(req: CustomRequest, res: Response): Promise<Response>;
    updateTask(req: Request, res: Response): Promise<Response>;
    deleteTask(req: Request, res: Response): Promise<Response>;
    getTasksByEmployeeId(req: CustomRequest, res: Response): Promise<Response>;
    updateTaskCompletion(req:CustomRequest , res:Response):Promise<Response>
    updateTaskApproval(req:CustomRequest , res:Response):Promise<Response>
    getTaskListOfEmployee(req:CustomRequest , res:Response):Promise<Response>
    updateCompletedTask(req:CustomRequest , res:Response):Promise<Response>
    reassignTask(req:CustomRequest , res:Response):Promise<Response>

}