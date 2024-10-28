import { Router } from "express";
import superAdminController from "../controllers/implementation/superAdminController";

const superAdminRouter = Router();

superAdminRouter.get("/fetch-companies",superAdminController.getAllCompanies);



export default superAdminRouter;