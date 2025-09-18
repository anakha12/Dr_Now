import Stripe from "stripe";
import dotenv from "dotenv";
import { Messages } from "../utils/Messages";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error( Messages.STRIPE_KEY_MISSING);


export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
});
