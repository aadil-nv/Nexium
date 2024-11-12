import { Router } from 'express';
import container from "../config/inversify";
import ISuperAdminController from '../controllers/interface/ISuperAdminController'; // Use interface



const superAdminRouter = Router();

const superAdminController = container.get<ISuperAdminController>("ISuperAdminController");

superAdminRouter.post('/superadmin-login', (req, res, next) => superAdminController.adminLogin(req, res, next));

superAdminRouter.post('/register', (req, res) => superAdminController.adminRegister(req, res));

superAdminRouter.post('/refresh-token', (req, res) => superAdminController.setNewAccessToken(req, res));

// Uncomment this if you need the refresh access token route

export default superAdminRouter;
