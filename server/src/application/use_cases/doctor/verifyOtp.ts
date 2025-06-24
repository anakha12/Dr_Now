import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class VerifyDoctorOtp {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(email: string, otp: string): Promise<boolean> {
    const doctor = await this.doctorRepository.findByEmail(email);
    if (!doctor) throw new Error("Doctor not found");
    if (doctor.otp !== otp) throw new Error("Invalid OTP");
    if (doctor.otpExpiresAt && doctor.otpExpiresAt < new Date()) throw new Error("OTP expired");

   
    await this.doctorRepository.updateDoctor(doctor.id!, {
      isActive: true,
      otp: undefined,
      otpExpiresAt: undefined,
    });
    return true;
  }
}