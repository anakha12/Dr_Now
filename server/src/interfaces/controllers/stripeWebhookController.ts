
import { Request, Response } from "express";
import Stripe from "stripe";
import { StripeWebhookUseCase } from "../../application/use_cases/stripe/stripeWebhookUseCase";
import { handleControllerError } from "../../utils/errorHandler";
import { HttpStatus } from "../../utils/HttpStatus";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


export class StripeWebhookController {
  constructor(private readonly _stripeWebhookUseCase: StripeWebhookUseCase) {}

  handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: unknown) {
      return handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await this._stripeWebhookUseCase.handleCheckoutSession(session);
      }
      return res.json({ received: true });
    } catch (err: unknown) {
      return handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
