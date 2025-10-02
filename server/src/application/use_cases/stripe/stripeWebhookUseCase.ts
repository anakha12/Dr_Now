// application/use_cases/stripe/stripeWebhookUseCase.ts
import { Stripe } from "stripe";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking } from "../../../domain/entities/booking.entity";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { ErrorMessages } from "../../../utils/Messages";

export class StripeWebhookUseCase {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly adminWalletRepo: IAdminWalletRepository
  ) {}

  async handleCheckoutSession(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;
    if (!metadata) {
      throw new Error(ErrorMessages.METADATA_MISSING);
    }
    const fee = parseFloat(metadata.fee);
    if (isNaN(fee)) throw new Error(ErrorMessages.FEE_INVALID + metadata.fee);
    const commissionRate = 0.1;
    const commissionAmount = parseFloat((fee * commissionRate).toFixed(2));
    const doctorEarning = parseFloat((fee - commissionAmount).toFixed(2));

    // Create Booking entity
    const booking = new Booking(
      metadata.doctorId,
      metadata.userId,
      metadata.date,
      metadata.slotFrom,
      metadata.slotTo,
      "Upcoming",
      "paid",
      session.payment_intent as string,
      doctorEarning,
      commissionAmount
    );

    // Save booking
    const savedBooking = await this.bookingRepo.createBooking(booking);

    // Update admin wallet with commission
    await this.adminWalletRepo.creditCommission(
      {
        amount: commissionAmount,
        doctorId: metadata.doctorId,
        userId: metadata.userId,
        bookingId: savedBooking.id!,
        description: "Commission from booking",
        type: "credit",
      },
      commissionAmount
    );
  }
}
