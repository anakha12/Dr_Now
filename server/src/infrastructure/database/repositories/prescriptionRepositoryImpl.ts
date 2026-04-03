
import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";
import { Prescription } from "../../../domain/entities/prescriptionEntity";
import BookingModel from "../models/booking.model";

export class PrescriptionRepositoryImpl implements IPrescriptionRepository {
  async addPrescription(
    bookingId: string,
    prescription: Prescription
  ): Promise<Prescription> {
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { prescription },
      { new: true }
    );
    if (!updatedBooking) throw new Error("Booking not found");

    return prescription;
  }
}