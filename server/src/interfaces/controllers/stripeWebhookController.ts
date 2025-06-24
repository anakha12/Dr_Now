// src/interfaces/controllers/stripeWebhookController.ts
import { Request, Response } from "express";
import { StripeWebhookUseCase } from "../../application/use_cases/stripe/stripeWebhookUseCase";
import { stripe } from "../../config/stripe"; 

export class StripeWebhookController {
  constructor(private stripeWebhookUseCase: StripeWebhookUseCase) {}

  handleStripeWebhook = async (req: Request, res: Response) => {
    console.log('hiii stripe...')
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    } catch (err: any) {
      console.error(" Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
     

      try {
        await this.stripeWebhookUseCase.handleCheckoutSession(session);
      } catch (err: any) {
        console.error("Booking failed to save:", err.message);
        return res.status(500).send("Failed to save booking");
      }
    } else {
      console.log(` Received non-handled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  };
}
