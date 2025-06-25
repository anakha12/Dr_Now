import { Stripe } from "stripe";
import { BookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking } from "../../../domain/entities/bookingEntity";
import { AdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";

export class StripeWebhookUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private adminWalletRepo: AdminWalletRepository
  ) {}

  async handleCheckoutSession(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;
    if (!metadata) {
      throw new Error("Missing metadata in session");
    }

    try {

      const fee = parseFloat(metadata.fee);
      if (isNaN(fee)) throw new Error(" Fee is NaN. Metadata.fee: " + metadata.fee);

      const commissionRate = 0.1;
      const commissionAmount = parseFloat((fee * commissionRate).toFixed(2));
      const doctorEarning = parseFloat((fee - commissionAmount).toFixed(2));

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
        status: "Upcoming",
        commissionAmount,
        doctorEarning,
      };

      const savedBooking = await this.bookingRepo.createBooking(booking);
      console.log(" Booking saved with ID:", savedBooking.id);

      console.log(" About to credit commission to admin wallet...");
      console.log(" Transaction Details:", {
        amount: commissionAmount,
        doctorId: metadata.doctorId,
        userId: metadata.userId,
        bookingId: savedBooking.id,
        description: "Commission from booking",
        type: "credit",
      });

      await this.adminWalletRepo.creditCommission(
        {
          amount: fee,
          doctorId: metadata.doctorId,
          userId: metadata.userId,
          bookingId: savedBooking.id,
          description: "Commission from booking",
          type: "credit",
        },
        fee
      );

      console.log(" Commission credited to admin wallet");

    } catch (error) {
      console.error(" Error in handleCheckoutSession:", error);
      throw error; 
    }
  }
}
