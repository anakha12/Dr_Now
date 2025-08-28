import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { deleteOTP, getOTP } from "../../../services/otpService";
import { IVerifyDoctorOtp } from "../interfaces/doctor/IVerifyDoctorOtp";


export class VerifyDoctorOtp implements IVerifyDoctorOtp{
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(email: string, otp: string): Promise<string > {
    const doctor = await this._doctorRepository.findByEmail(email);
    if (!doctor) throw new Error("Doctor not found");

   const storedOtp= await getOTP(email);
   if(!storedOtp) throw new Error("OTP not found")
    
    if(storedOtp !==otp) throw new Error("Invalid OTP");
    await deleteOTP(email);
    await this._doctorRepository.updateDoctor(doctor.id!, {
      isActive: true
    });
    return doctor.id!;
  }
}