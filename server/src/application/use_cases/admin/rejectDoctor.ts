import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { sendMail } from "../../../services/mailService";
import { IRejectDoctorUseCase } from "../interfaces/admin/IRejectDoctorUseCase";

export class RejectDoctor implements IRejectDoctorUseCase{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string): Promise<void> {
    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    doctor.isRejected = true;
    await this._doctorRepo.updateDoctor(doctorId, doctor);

    const subject = "Doctor Application Rejected";
    const message = `Dear Dr. ${doctor.name},\n\nWe regret to inform you that your application to join our platform as a doctor has been rejected after careful review.\nIf you believe this was a mistake or have any questions, please reach out to our support team.\n\nBest regards,\nTeam`;

    await sendMail(doctor.email, subject, message);
  }
}
