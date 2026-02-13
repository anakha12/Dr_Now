import { UpdateUserProfileRequestDTO  } from "../../../../interfaces/dto/request/update-user-profile.dto";
import { UpdateUserProfileResponseDTO } from "../../../../interfaces/dto/response/user/update-user-profile.dto";

export interface IUpdateUserProfileUseCase {
  execute(userId: string, data: UpdateUserProfileRequestDTO ): Promise<UpdateUserProfileResponseDTO>;
}



