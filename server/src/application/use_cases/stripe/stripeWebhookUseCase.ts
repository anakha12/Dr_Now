
import { Stripe } from "stripe";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { Booking } from "../../../domain/entities/bookingEntity";
import { IAdminWalletRepository } from "../../../domain/repositories/IAdminWalletRepository";
import { NotificationRepository } from "../../../domain/repositories/notificationRepository";
import { ErrorMessages } from "../../../utils/Messages";


export class StripeWebhookUseCase {
  constructor(
    private readonly _bookingRepo: IBookingRepository,
    private readonly _adminWalletRepo: IAdminWalletRepository,
    private readonly _notificationRepo: NotificationRepository
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
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        typeof (err as { code?: number }).code === "number" &&
        (err as { code?: number }).code === 11000
      ) {
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

    // Trigger Notification for the Doctor
    try {
      await this._notificationRepo.createNotification({
        recipientId: metadata.doctorId,
        message: `New Booking: Patient booked an appointment on ${metadata.date} (${metadata.slotFrom} - ${metadata.slotTo}) via Stripe.`,
        type: "success",
        read: false,
      });
    } catch (notifErr) {
      console.error("Failed to create notification for doctor (Stripe)", notifErr);
    }
  }
}
