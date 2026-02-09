import { AdminLoginDTO } from "../../../../interfaces/dto/request/admin-login.dto";
import { AdminLoginResponseDTO } from "../../../../interfaces/dto/response/admin/login-response.dto";

export interface ILoginAdmin {
  execute(dto: AdminLoginDTO): Promise<AdminLoginResponseDTO>;
}
