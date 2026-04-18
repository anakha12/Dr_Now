
import express from "express";
import bodyParser from "body-parser";
import { BookingRepositoryImpl } from "../../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../../infrastructure/database/repositories/adminWalletRepositoryImpl";
import { NotificationRepositoryImpl } from "../../infrastructure/database/repositories/notificationRepositoryImpl";
import { StripeWebhookUseCase } from "../../application/use_cases/stripe/stripeWebhookUseCase";
import { StripeWebhookController } from "../controllers/stripeWebhookController";

const router = express.Router();

const bookingRepo = new BookingRepositoryImpl();
const adminWalletRepo = new AdminWalletRepositoryImpl();
const notificationRepo = new NotificationRepositoryImpl();
const webhookUseCase = new StripeWebhookUseCase(bookingRepo, adminWalletRepo, notificationRepo);
const stripeWebhookController = new StripeWebhookController(webhookUseCase);
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookController.handleStripeWebhook
);

export default router;
