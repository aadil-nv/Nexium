import container  from "../config/inversify";
import IMessageController from "../controllers/interface/IMessageController";
import { Router } from "express";
import  authenticateToken  from "../middlewares/authMiddleware";

const messageRouter = Router();

const messageController = container.get<IMessageController>("IMessageController");


messageRouter.post('/create-message/:id',authenticateToken, (req, res ,next) => messageController.createMessage(req, res));

export default messageRouter;