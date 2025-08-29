import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorRegisterDTO } from "../../../interfaces/dto/request/doctor-register.dto."
import bcrypt from "bcrypt";
import { ISendDoctorOtp } from "../interfaces/doctor/ISendDoctorOtp";
import { redisClient } from "../../../config/redis";

export class SendDoctorOtp implements ISendDoctorOtp{
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(dto: DoctorRegisterDTO): Promise<void> {

     const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expireSeconds = 10 * 60
    
    console.log(`Generated OTP: ${otp}, Expires At: ${expireSeconds}`);
    const existingDoctor = await this._doctorRepository.findByEmail(dto.email);
    if (existingDoctor) {
      throw new Error("Doctor already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10); 

    await redisClient.setEx(dto.email, expireSeconds, otp);

    const doctorSave={
      ...dto,
      password:hashedPassword
    }

    await this._doctorRepository.createDoctor(doctorSave);

  
    console.log(`OTP sent to ${dto.email}: ${otp}`);
  }

}
