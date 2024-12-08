import container from "../config/inversify";
import { Router } from "express";
import IBusinessOwnerPaymentController from "../controllers/interface/IBusinessOwnerPaymentController";
import express from "express";
import authenticateToken from "../middlewares/authMiddleware";

const businessOwnerPaymentController = container.get<IBusinessOwnerPaymentController>("IBusinessOwnerPaymentController");

const webhookRoute = Router();

// Handle POST requests for Stripe webhook
webhookRoute.post("/", express.raw({ type: 'application/json' }), (req, res) => {
  // Call the controller's handleWebhook method
  return businessOwnerPaymentController.handleWebhook(req, res);
});

export default webhookRoute;
