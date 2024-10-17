import { Router, Request, Response } from "express";
import AdminController from "../Controllers/implementation/superAdminController";
import authMiddleware from "../MIddlewares/authMiddleware";

const superAdminRouter = Router();

superAdminRouter.post("/login", async (req: Request, res: Response) => { 
  try {
    await AdminController.adminLogin(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

superAdminRouter.post("/register", async (req: Request, res: Response) => {
  try {
    await AdminController.adminRegister(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

superAdminRouter.post("/refresh-token", async (req: Request, res: Response) => {
  try {
    await AdminController.refreshAccessToken(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

superAdminRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    await AdminController.logout(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default superAdminRouter;
