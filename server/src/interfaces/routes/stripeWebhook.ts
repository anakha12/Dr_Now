// src/interfaces/routes/stripeWebhook.ts
import express from "express";
import bodyParser from "body-parser";

import { BookingRepositoryImpl } from "../../infrastructure/database/repositories/bookingRepositoryImpl";
import { StripeWebhookUseCase } from "../../application/use_cases/stripe/stripeWebhookUseCase";
import { StripeWebhookController } from "../controllers/stripeWebhookController";
import { AdminWalletRepositoryImpl } from "../../infrastructure/database/repositories/adminWalletRepositoryImpl";

const router = express.Router();


const bookingRepo = new BookingRepositoryImpl();
const adminWalletRepo = new AdminWalletRepositoryImpl(); 
const webhookUseCase = new StripeWebhookUseCase(bookingRepo, adminWalletRepo); 
const stripeWebhookController = new StripeWebhookController(webhookUseCase);


router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), 
  (req, res, next) => {
    next();
  },
  stripeWebhookController.handleStripeWebhook
);


export default router;
