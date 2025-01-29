import { CustomRequest } from "../../middlewares/tokenAuth";
import { Response } from "express";

export default interface IDepartmentController {
    getDepartment(req: CustomRequest, res: Response): Promise<Response>
}