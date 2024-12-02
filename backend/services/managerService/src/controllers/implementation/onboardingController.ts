import { inject ,injectable } from "inversify";
import { Request, Response } from "express";
import  IOnboardingService  from "../../service/interface/IOnboardingService";
import  IOnboardingController  from "../interface/IOnboardingController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";

@injectable()
export default class OnboardingController implements IOnboardingController {

    constructor(
        @inject("IOnboardingService") private _onboardingService: IOnboardingService
    ) {}

    async addOnboardingEmployee(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const managerId = req?.user?.managerData?._id;
            const result =  this._onboardingService.addOnboardingEmployee(req.body, managerId as string);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Failed to add onboarding employee" });
        }
       
    }
}