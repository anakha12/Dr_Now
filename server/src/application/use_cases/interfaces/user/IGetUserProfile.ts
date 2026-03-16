import { BasicUserProfileResponseDTO } from "../../../../interfaces/dto/response/user/basic-user-profile.dto";
import { FullUserProfileResponseDTO } from "../../../../interfaces/dto/response/user/full-user-profile.dto";

export interface IGetUserProfile {
  execute(
    userId: string
  ): Promise<FullUserProfileResponseDTO | BasicUserProfileResponseDTO>;
}