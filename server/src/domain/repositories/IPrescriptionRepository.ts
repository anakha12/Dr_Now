
import { Prescription } from "../entities/prescriptionEntity";

export interface IPrescriptionRepository {
  addPrescription(
    bookingId: string,
    prescription: Prescription
  ): Promise<Prescription>;
}