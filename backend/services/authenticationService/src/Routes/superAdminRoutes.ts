import { Router } from 'express';
import container from "../Config/inversify";
import ISuperAdminController from '../Controllers/interface/ISuperAdminController'; // Use interface

const superAdminRouter = Router();

const superAdminController = container.get<ISuperAdminController>("ISuperAdminController");

superAdminRouter.post('/login', (req, res, next) => superAdminController.adminLogin(req, res, next));

superAdminRouter.post('/register', (req, res) => superAdminController.adminRegister(req, res));

// Uncomment this if you need the refresh access token route
// superAdminRouter.post('/refresh', (req, res) => superAdminController.refreshAccessToken(req, res));

export default superAdminRouter;
