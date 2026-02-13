
import { Stripe } from "stripe";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking } from "../../../domain/entities/booking.entity";
import { IAdminWalletRepository } from "../../../domain/repositories/adminWalletRepository";
import { ErrorMessages } from "../../../utils/Messages";


const Max_limit=5;
export class StripeWebhookUseCase {
  constructor(
    private readonly _bookingRepo: IBookingRepository,
    private readonly _adminWalletRepo: IAdminWalletRepository
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


    let savedBooking;
    try {
      savedBooking = await this._bookingRepo.createBooking(booking);
    } catch (err: any) {
     
      if (err.code === 11000) {
        throw new Error("This slot is already booked. Please choose another time.");
      }
      throw err; 
    }


    await this._adminWalletRepo.creditCommission(
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
