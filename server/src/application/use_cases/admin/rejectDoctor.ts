import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { sendMail } from "../../../services/mailService";
import { EmailSubjects, EmailTemplates } from "../../../utils/Constance";
import { ErrorMessages } from "../../../utils/Messages";
import { IRejectDoctorUseCase } from "../interfaces/admin/IRejectDoctorUseCase";

export class RejectDoctor implements IRejectDoctorUseCase {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string, reason: string): Promise<void> {
    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) {
      throw new Error(ErrorMessages.DOCTOR_NOT_FOUND);
    }

    doctor.isRejected = true;
    doctor.rejectionReason = reason; 
    await this._doctorRepo.updateDoctor(doctorId, doctor);

    const subject = EmailSubjects.DOCTOR_REJECTED;
    const message = EmailTemplates.DOCTOR_REJECTED(doctor.name, reason);

    await sendMail(doctor.email, subject, message);
  }
}

