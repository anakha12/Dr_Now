import { DoctorLoginDTO } from "../../../../interfaces/dto/request/doctor-login.dto";
import { DoctorLoginResponseDTO } from "../../../../interfaces/dto/response/doctor/login-response.dto";


export interface IDoctorLogin {
  execute(
    dto:DoctorLoginDTO
  ): Promise<
     { accessToken: string; refreshToken: string; user: DoctorLoginResponseDTO }
   
  >;
}