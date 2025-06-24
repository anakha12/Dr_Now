// src/application/use_cases/stripe/stripeWebhookUseCase.ts
import { Stripe } from "stripe";
import { BookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking } from "../../../domain/entities/bookingEntity";

export class StripeWebhookUseCase {
  constructor(private bookingRepo: BookingRepository) {}

  async handleCheckoutSession(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;
    if (!metadata) throw new Error("Missing metadata in session");

    const booking: Booking = {
        userId: metadata.userId,
        doctorId: metadata.doctorId,
        slot: {
            from: metadata.slotFrom,
            to: metadata.slotTo,
        },
        date: metadata.date,
        paymentStatus: "paid",
        transactionId: session.payment_intent as string,
    };


    await this.bookingRepo.createBooking(booking); 
  }
}
