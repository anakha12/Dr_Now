import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";
import { DoctorRegisterDTO } from "../../dto/doctorRegister.dto";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { ISendDoctorOtp } from "../interfaces/doctor/ISendDoctorOtp";

export class SendDoctorOtp implements ISendDoctorOtp{
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(dto: DoctorRegisterDTO): Promise<void> {
    const existingDoctor = await this._doctorRepository.findByEmail(dto.email);
    if (existingDoctor) {
      throw new Error("Doctor already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10); 
    const otp = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    const doctorToSave: DoctorEntity = {
      id: "", 
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      yearsOfExperience: dto.yearsOfExperience,
      specialization: dto.specialization,
      password: hashedPassword,
      profileImage: dto.profileImage,
      medicalLicense: dto.medicalLicense,
      idProof: dto.idProof,
      gender: dto.gender,
      consultFee: dto.consultFee,
      availability:dto.availability || [],
      isVerified: false,
      isBlocked: false,
      isActive: false,
      otp,
      otpExpiresAt,
      role: "doctor"
    };

    await this._doctorRepository.createDoctor(doctorToSave);

  
    console.log(`OTP sent to ${dto.email}: ${otp}`);
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString(); 
  }
}
