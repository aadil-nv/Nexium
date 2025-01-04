import express, { Router } from "express";
import container from "../config/inversify";
import IBusinessOwnerController from "../controllers/interface/IBusinessOwnerController";


const businessOwnerRouter = Router();

const businessOwnerController = container.get<IBusinessOwnerController>("IBusinessOwnerController");


businessOwnerRouter.post("/login", (req, res, next) => businessOwnerController.login(req, res));

businessOwnerRouter.post("/register", (req, res,next) => businessOwnerController.register(req, res,next));

businessOwnerRouter.post("/otp-validation", (req, res,next) => businessOwnerController.validateOtp(req, res,next));

// businessOwnerRouter.post("/create-checkout-session", (req, res) => businessOwnerController.createCheckoutSession(req, res));

businessOwnerRouter.post("/forgot-password", (req, res) => businessOwnerController.forgotPassword(req, res));

businessOwnerRouter.post("/resend-otp", (req, res) => businessOwnerController.resendOtp(req, res));

businessOwnerRouter.patch("/add-newpassword", (req, res) => businessOwnerController.addNewPassword(req, res));

export default businessOwnerRouter;
