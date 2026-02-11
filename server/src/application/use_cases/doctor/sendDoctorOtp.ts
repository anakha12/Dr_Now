import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorRegisterDTO } from "../../../interfaces/dto/request/doctor-register.dto."
import { ISendDoctorOtp } from "../interfaces/doctor/ISendDoctorOtp";
import { redisClient } from "../../../config/redis";
import { ErrorMessages } from "../../../utils/Messages";
import { BaseUseCase } from "../base-usecase";
import bcrypt from "bcrypt";

type MulterFiles = {
  profileImage?: Express.Multer.File[];
  medicalLicense?: Express.Multer.File[];
  idProof?: Express.Multer.File[];
};

export type SendDoctorOtpInput = Omit<DoctorRegisterDTO, "profileImage" | "medicalLicense" | "idProof"> & {
  files?: MulterFiles;
};

export class SendDoctorOtp
  extends BaseUseCase<DoctorRegisterDTO, void>
  implements ISendDoctorOtp
{
  constructor(private _doctorRepository: IDoctorRepository) {
    super();
  }

  async execute(input: SendDoctorOtpInput): Promise<void> {
   
    const dtoData: DoctorRegisterDTO = {
      ...input,
      profileImage: input.files?.profileImage?.[0]?.path ?? "",
      medicalLicense: input.files?.medicalLicense?.[0]?.path ?? "",
      idProof: input.files?.idProof?.[0]?.path ?? "",
    } as DoctorRegisterDTO;

   
    const dto = await this.validateDto(DoctorRegisterDTO, dtoData);

    
    const existingDoctor = await this._doctorRepository.findByEmail(dto.email);
    if (existingDoctor) {
      throw new Error(ErrorMessages.DOCTOR_ALREADY_EXISTS);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireSeconds = 10 * 60;
    await redisClient.setEx(dto.email, expireSeconds, otp);

   
    const hashedPassword = await bcrypt.hash(dto.password, 10);

   
    await this._doctorRepository.createDoctor({
      ...dto,
      password: hashedPassword,
    });
  }
}
