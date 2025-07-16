import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

export class VerifyDoctorOtp {
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(email: string, otp: string): Promise<string > {
    const doctor = await this._doctorRepository.findByEmail(email);
    if (!doctor) throw new Error("Doctor not found");
    if (doctor.otp !== otp) throw new Error("Invalid OTP");
    if (doctor.otpExpiresAt && doctor.otpExpiresAt < new Date()) throw new Error("OTP expired");

   
    await this._doctorRepository.updateDoctor(doctor.id!, {
      isActive: true,
      otp: undefined,
      otpExpiresAt: undefined,
    });
    return doctor.id!;
  }
}