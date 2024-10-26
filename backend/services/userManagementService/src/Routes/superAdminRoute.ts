import { Router } from "express";
import superAdminController from "../Controllers/implementation/superAdminController";

const superAdminRouter = Router();

superAdminRouter.get("/fetch-companies",superAdminController.getAllCompanies);



export default superAdminRouter;