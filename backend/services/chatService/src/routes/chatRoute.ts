import container from "../config/inversify";
import IChatController from "../controllers/interface/IChatController";
import { Router } from "express";
import  authenticateToken  from "../middlewares/authMiddleware";

const chatRouter = Router();

const chatController = container.get<IChatController>("IChatController");

chatRouter.get('/get-all-receiver',authenticateToken, (req, res ,next) => chatController.getAllReceiver(req, res));
chatRouter.get('/get-all-groups',authenticateToken, (req, res ,next) => chatController.getAllGroups(req, res));
chatRouter.get('/get-all-chats',authenticateToken, (req, res ,next) => chatController.getAllPrivateChats(req, res));

chatRouter.post('/create-chat/:id',authenticateToken, (req, res ,next) => chatController.createChat(req, res));
chatRouter.post("/create-message/:id",authenticateToken, (req, res ,next) => chatController.createMessage(req, res));
chatRouter.post('/create-group',authenticateToken, (req, res ,next) => chatController.createGroup(req, res));




chatRouter.post("/refresh-token",(req, res)=> chatController.setNewAccessToken (req, res));
chatRouter.post("/logout",(req, res)=> chatController.logout (req, res));


export default chatRouter;