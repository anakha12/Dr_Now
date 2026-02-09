import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorRegisterDTO } from "../../../interfaces/dto/request/doctor-register.dto."
import bcrypt from "bcrypt";
import { ISendDoctorOtp } from "../interfaces/doctor/ISendDoctorOtp";
import { redisClient } from "../../../config/redis";
import { ErrorMessages } from "../../../utils/Messages";

export class SendDoctorOtp implements ISendDoctorOtp{
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(dto: DoctorRegisterDTO): Promise<void> {
     const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expireSeconds = 10 * 60
    
    const existingDoctor = await this._doctorRepository.findByEmail(dto.email);
    if (existingDoctor) {
      throw new Error( ErrorMessages.DOCTOR_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10); 

    await redisClient.setEx(dto.email, expireSeconds, otp);

    const doctorSave={
      ...dto,
      password:hashedPassword
    }

    await this._doctorRepository.createDoctor(doctorSave);
  }

}
