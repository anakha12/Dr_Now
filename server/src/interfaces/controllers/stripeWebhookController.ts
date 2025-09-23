import { Request, Response } from "express";
import { StripeWebhookUseCase } from "../../application/use_cases/stripe/stripeWebhookUseCase";
import { stripe } from "../../config/stripe"; 
import logger from "../../utils/Logger";
import { StripeWebhookMessages as SWM } from "../../utils/Messages";

export class StripeWebhookController {
  constructor(private stripeWebhookUseCase: StripeWebhookUseCase) {}

  handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    } catch (err: any) {
      logger.error(SWM.WEBHOOK_ERROR(err), { message: err.message });
      return res.status(400).send(SWM.WEBHOOK_ERROR(err));
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        await this.stripeWebhookUseCase.handleCheckoutSession(session);
      } catch (err: any) {
        logger.error(SWM.FAILED_TO_SAVE_BOOKING, { message: err.message });
        return res.status(500).send(SWM.FAILED_TO_SAVE_BOOKING);
      }
    } else {
      logger.warn(SWM.UNHANDLED_EVENT(event.type));
    }

    res.status(200).json(SWM.WEBHOOK_RECEIVED);
  };
}
