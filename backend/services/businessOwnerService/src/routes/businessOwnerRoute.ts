import { Router, } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "controllers/interface/IBusinessOwnerController";
import authenticateToken from "../middlewares/authMiddleware";

const businessOwnerRouter = Router();
const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController")

// businessOwnerRouter.get('/get-profile', authenticateToken, (req, res, next) => businessOwnerController.getProfile(req, res));
businessOwnerRouter.post('/refresh-token',(req, res, next) => businessOwnerController.setNewAccessToken(req, res));
businessOwnerRouter.post('/logout', (req, res, next) => businessOwnerController.logout(req, res));


export default businessOwnerRouter;