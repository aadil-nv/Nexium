import container  from "../config/inversify";
import INotificationController from "../controllers/interface/INotificationController";
import { Router } from "express";
import  authenticateToken  from "../middlewares/authMiddleware";

const notificationRouter = Router();

const notificationController = container.get<INotificationController>("INotificationController");

notificationRouter.get('/get-all-notifications',authenticateToken, (req, res ,next) => notificationController.getAllNotifications(req, res));

export default notificationRouter;