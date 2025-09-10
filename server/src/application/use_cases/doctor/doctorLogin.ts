import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import bcrypt from "bcrypt";
import { IDoctorLogin } from "../interfaces/doctor/IDoctorLogin";
import { ITokenService } from "../../../interfaces/tokenServiceInterface";
import { plainToInstance } from "class-transformer";
import { DoctorLoginResponseDTO } from "../../../interfaces/dto/response/doctor/login-response.dto";
import { DoctorLoginDTO } from "../../../interfaces/dto/request/doctor-login.dto";
import { BaseUseCase } from "../base-usecase";

export class DoctorLogin
  extends BaseUseCase<DoctorLoginDTO, { accessToken: string; refreshToken: string; user: DoctorLoginResponseDTO }>
  implements IDoctorLogin
{
  constructor(
    private _doctorRepo: IDoctorRepository,
    private _tokenService: ITokenService) {
       super(); 
    }

  async execute(data: DoctorLoginDTO): Promise<
    { accessToken: string; refreshToken: string; user: DoctorLoginResponseDTO }
  > {

    const dto= await this.validateDto(DoctorLoginDTO, data)

    const doctor = await this._doctorRepo.findByEmail(dto.email);
  
    if (!doctor) throw new Error("Doctor not found");
   
    if (doctor.isRejected) throw new Error("This doctor is rejected");

    if (!doctor.isVerified) throw new Error(" not verified")

    const isMatch = await bcrypt.compare(dto.password, doctor.password);
    if (!isMatch) throw new Error("Incorrect password");

    const accessToken = this._tokenService.generateAccessToken(
      { id: doctor.id!, email: doctor.email, role: doctor.role },
      
    );
     
    const refreshToken = this._tokenService.generateRefreshToken(
      { id: doctor.id!, email: doctor.email, role: doctor.role },
      
    );
    
    const user= plainToInstance( DoctorLoginResponseDTO,{
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
    })
   
    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

