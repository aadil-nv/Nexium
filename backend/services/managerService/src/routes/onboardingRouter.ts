import container from "../config/inversify";
import { Router } from "express";
import IOnboardingController from "../controllers/interface/IOnboardingController";
import authenticateToken from "../middlewares/tokenAuthenticate";

const onboardingRouter = Router();


const onboardingController = container.get<IOnboardingController>("IOnboardingController");


onboardingRouter.post("/add-onboarding",authenticateToken, (req, res) => onboardingController.addOnboardingEmployee(req , res));

export default onboardingRouter