
import { Prescription } from "../entities/prescription.entity";

export interface IPrescriptionRepository {
  addPrescription(
    bookingId: string,
    prescription: Prescription
  ): Promise<Prescription>;
}