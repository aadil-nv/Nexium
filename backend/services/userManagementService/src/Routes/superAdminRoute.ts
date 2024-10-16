import { Router, Request, Response } from "express";
import superAdminController from "../Controllers/implementation/superAdminController";

const superAdminRouter = Router();

superAdminRouter.get("/fetch-companies", async (req: Request, res: Response) => {
  try {
    
    
    await superAdminController.getAllCompanies(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



export default superAdminRouter;