import container  from "../config/inversify";
import IMessageController from "../controllers/interface/IMessageController";
import { Router } from "express";
import  authenticateToken  from "../middlewares/authMiddleware";

const messageRouter = Router();

const messageController = container.get<IMessageController>("IMessageController");


// messageRouter.post('/create-message/:id',authenticateToken, (req, res ,next) => messageController.createMessage(req, res));
messageRouter.get('/get-all-messages/:id',authenticateToken, (req, res ,next) => messageController.getAllMessages(req, res));
messageRouter.delete('/delete-message/:id',authenticateToken, (req, res ,next) => messageController.deleteMessage(req, res));

export default messageRouter;