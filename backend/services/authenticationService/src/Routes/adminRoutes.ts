import { Router, Request, Response } from "express";
import AdminController from "../Controllers/adminController";
import authMiddleware from "../MIddlewares/authMiddleware";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
   
  try {
    await AdminController.adminLogin(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    await AdminController.adminRegister(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/refresh-token", async (req: Request, res: Response) => {
  try {
    await AdminController.refreshAccessToken(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    await AdminController.logout(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
