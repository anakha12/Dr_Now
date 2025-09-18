
import { Request, Response } from "express";
import { StripeWebhookUseCase } from "../../application/use_cases/stripe/stripeWebhookUseCase";
import { AdminWalletRepositoryImpl } from "../../infrastructure/database/repositories/adminWalletRepositoryImpl";
import { stripe } from "../../config/stripe"; 
import { StripeWebhookMessages } from "../../utils/Messages";

export class StripeWebhookController {
  constructor(private stripeWebhookUseCase: StripeWebhookUseCase) {}

  handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    } catch (err: any) {
      return res.status(400).send( StripeWebhookMessages.WEBHOOK_ERROR(err));
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
     

      try {
        await this.stripeWebhookUseCase.handleCheckoutSession(session);
      } catch (err: any) {
        return res.status(500).send( StripeWebhookMessages.FAILED_TO_SAVE_BOOKING);
      }
    } else {
      console.log(StripeWebhookMessages.RECEIVED_NON_HANDLED_EVENT(event.type));
    }

    res.status(200).json(StripeWebhookMessages.WEBHOOK_RECEIVED);
  };
}
