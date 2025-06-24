import { DoctorRepository } from "../../../domain/repositories/doctorRepository";
import { sendMail } from "../../../services/mailService";

export class RejectDoctor {
  constructor(private doctorRepo: DoctorRepository) {}

  async execute(doctorId: string): Promise<void> {
    const doctor = await this.doctorRepo.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    doctor.isRejected = true;
    await this.doctorRepo.updateDoctor(doctorId, doctor);

    const subject = "Doctor Application Rejected";
    const message = `Dear Dr. ${doctor.name},\n\nWe regret to inform you that your application to join our platform as a doctor has been rejected after careful review.\nIf you believe this was a mistake or have any questions, please reach out to our support team.\n\nBest regards,\nTeam`;

    await sendMail(doctor.email, subject, message);
  }
}
