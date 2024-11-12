import { Request, Response } from "express";

export default interface IBusinessOwnerController {
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
}
