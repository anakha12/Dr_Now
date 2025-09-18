import { Stripe } from "stripe";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking } from "../../../domain/entities/booking.entity";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { ErrorMessages } from "../../../utils/Messages";

export class StripeWebhookUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _adminWalletRepo: IAdminWalletRepository
  ) {}

  async handleCheckoutSession(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;
    if (!metadata) {
      throw new Error( ErrorMessages.METADATA_MISSING);
    }

    try {

      const fee = parseFloat(metadata.fee);
      if (isNaN(fee)) throw new Error( ErrorMessages.FEE_INVALID + metadata.fee);

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

      const savedBooking = await this._bookingRepo.createBooking(booking);

      await this._adminWalletRepo.creditCommission(
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

    } catch (error) {
      throw error; 
    }
  }
}
