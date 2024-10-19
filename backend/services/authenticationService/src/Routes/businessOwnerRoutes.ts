import express, { Router, Request, Response } from "express";
import { BusinessOwnerController } from "../Controllers/implementation/businessOwnerController";
import StripeWebhookController from "../hooks/StripeWebhook";

const businessOwnerRouter = Router();
const businessOwnerController = new BusinessOwnerController();

businessOwnerRouter.post("/login",businessOwnerController.login);

businessOwnerRouter.post("/register", businessOwnerController.register);

businessOwnerRouter.post("/otp-validation", businessOwnerController.validateOtp);

businessOwnerRouter.post("/create-checkout-session", businessOwnerController.createCheckoutSession);

businessOwnerRouter.post( "/webhook", express.raw({ type: "application/json" }),
    StripeWebhookController.handleStripeWebhook.bind(StripeWebhookController)
);

businessOwnerRouter.post("/forgott-password", businessOwnerController.forgotPassword);

businessOwnerRouter.post("/resend-otp",businessOwnerController.resendOtp);

businessOwnerRouter.patch("/add-newpassword",businessOwnerController.addNewPassword);

export default businessOwnerRouter;
