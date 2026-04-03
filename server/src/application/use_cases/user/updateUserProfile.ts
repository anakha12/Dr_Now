import { IUpdateUserProfileUseCase } from "../interfaces/user/IUpdateUserProfile";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UpdateUserProfileRequestDTO } from "../../../interfaces/dto/request/update-user-profile.dto";
import { UpdateUserProfileResponseDTO } from "../../../interfaces/dto/response/user/update-user-profile.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { cloudinary, getSignedImageURL } from "../../../config/cloudinary";
import { Messages } from "../../../utils/Messages";
import { UpdateUserProfileMapper } from "../../mappers/user/update-user-profile.mapper";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    userId: string,
    dto: UpdateUserProfileRequestDTO
  ): Promise<UpdateUserProfileResponseDTO> {

    const validatedDto = plainToInstance(UpdateUserProfileRequestDTO, dto);
    await validateOrReject(validatedDto);


    const existingUser = await this._userRepository.findUserById(userId);
    if (!existingUser) throw new Error(Messages.USER_NOT_FOUND);

    if (validatedDto.file) {
      const result = await cloudinary.uploader.upload(validatedDto.file.path, {
        folder: "users",
        public_id: `user_${userId}_${Date.now()}`,
        type: "authenticated",
      });
      validatedDto.image = getSignedImageURL(result.public_id, result.format, 600);
    }
    const updates = UpdateUserProfileMapper.toUpdateData(
      validatedDto,
      existingUser
    );
    const updatedUser = await this._userRepository.updateUserProfile(
      userId,
      updates
    );
    return UpdateUserProfileMapper.toResponseDTO(updatedUser);
  }
}