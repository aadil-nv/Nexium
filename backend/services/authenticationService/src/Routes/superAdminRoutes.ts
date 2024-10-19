import { Router, Request, Response } from "express";
import AdminController from "../Controllers/implementation/superAdminController";
import authMiddleware from "../MIddlewares/authMiddleware";

const superAdminRouter = Router();

superAdminRouter.post("/login",AdminController.adminLogin);

superAdminRouter.post("/register",AdminController.adminRegister);

superAdminRouter.post("/refresh-token",AdminController.refreshAccessToken);

superAdminRouter.post("/logout",AdminController.logout);

export default superAdminRouter;
