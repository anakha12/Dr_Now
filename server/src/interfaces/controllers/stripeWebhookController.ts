// controllers/stripeWebhookController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import { StripeWebhookUseCase } from "../../application/use_cases/stripe/stripeWebhookUseCase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


export class StripeWebhookController {
  constructor(private readonly stripeWebhookUseCase: StripeWebhookUseCase) {}

  handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.stripeWebhookUseCase.handleCheckoutSession(session);
      }
      return res.json({ received: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
}
