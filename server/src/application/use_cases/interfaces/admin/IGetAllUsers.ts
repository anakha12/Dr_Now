import { GetAllUsersResponseDTO } from "../../../../interfaces/dto/response/admin/get-all-users.response.dto";

export interface IGetAllUsersUseCase {
  execute(query: unknown): Promise<GetAllUsersResponseDTO>;
}
