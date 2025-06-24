import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is not set");
console.log("Stripe redirecting to:", process.env.CLIENT_URL);

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2022-11-15" as const,
});
