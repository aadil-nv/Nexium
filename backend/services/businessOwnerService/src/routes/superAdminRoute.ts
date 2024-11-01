import { Router, Request, Response, NextFunction } from "express";
import ISuperAdminController from "../controllers/interface/ISuperAdminController";
import container from "../config/inversify";

const superAdminRouter = Router();

const superAdminController = container.get<ISuperAdminController>("ISuperAdminController");

superAdminRouter.get("/fetch-companies", (req: Request, res: Response, next: NextFunction) =>
  superAdminController.getAllCompanies(req, res)
);

export default superAdminRouter;