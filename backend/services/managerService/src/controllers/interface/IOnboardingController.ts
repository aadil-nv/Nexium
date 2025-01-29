import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
export default interface IOnboardingController {
    addOnboardingEmployee(req: CustomRequest, res: Response): Promise<Response>
}