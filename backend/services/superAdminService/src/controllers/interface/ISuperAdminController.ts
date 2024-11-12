import { Request, Response } from "express";

export default interface ISuperAdminController {
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
}