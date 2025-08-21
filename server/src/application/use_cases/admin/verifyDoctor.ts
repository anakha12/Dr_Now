import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { sendMail } from "../../../services/mailService";
import { IVerifyDoctorUseCase } from "../interfaces/admin/IVerifyDoctorUseCase";

export class VerifyDoctor implements IVerifyDoctorUseCase{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string): Promise<void> {
    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    doctor.isVerified = true;
    await this._doctorRepo.updateDoctor(doctorId, doctor);

    const subject = "Doctor Verification Successful";
    const message = `Dear Dr. ${doctor.name},\n\nYour application to become a doctor has been successfully verified.\nYou can now log in and access your account.\n\nBest regards,\nTeam`;

    await sendMail(doctor.email, subject, message);
  }
}
