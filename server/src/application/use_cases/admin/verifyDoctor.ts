import { DoctorRepository } from "../../../domain/repositories/doctorRepository";
import { sendMail } from "../../../services/mailService";

export class VerifyDoctor {
  constructor(private doctorRepo: DoctorRepository) {}

  async execute(doctorId: string): Promise<void> {
    const doctor = await this.doctorRepo.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    doctor.isVerified = true;
    await this.doctorRepo.updateDoctor(doctorId, doctor);

    const subject = "Doctor Verification Successful";
    const message = `Dear Dr. ${doctor.name},\n\nYour application to become a doctor has been successfully verified.\nYou can now log in and access your account.\n\nBest regards,\nTeam`;

    await sendMail(doctor.email, subject, message);
  }
}
