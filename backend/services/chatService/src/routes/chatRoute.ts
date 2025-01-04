import container from "../config/inversify";
import IChatController from "../controllers/interface/IChatController";
import { Router } from "express";
import  authenticateToken  from "../middlewares/authMiddleware";

const chatRouter = Router();

const chatController = container.get<IChatController>("IChatController");

chatRouter.post("/create",authenticateToken, (req, res ,next) => chatController.createChat(req, res));
chatRouter.get('/get-all-receiver',authenticateToken, (req, res ,next) => chatController.getAllReceiver(req, res));
chatRouter.post("/refresh-token",(req, res)=> chatController.setNewAccessToken (req, res));
chatRouter.post("/logout",(req, res)=> chatController.logout (req, res));


export default chatRouter;