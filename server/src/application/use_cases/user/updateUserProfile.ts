import { IUpdateUserProfileUseCase } from "../interfaces/user/IUpdateUserProfile";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UpdateUserProfileRequestDTO } from "../../../interfaces/dto/request/update-user-profile.dto";
import { UpdateUserProfileResponseDTO } from "../../../interfaces/dto/response/user/update-user-profile.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { cloudinary, getSignedImageURL } from "../../../config/cloudinary";
import { Messages } from "../../../utils/Messages";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    userId: string,
    dto: UpdateUserProfileRequestDTO
  ): Promise<UpdateUserProfileResponseDTO> {

    const validatedDto = plainToInstance(UpdateUserProfileRequestDTO, dto);
    await validateOrReject(validatedDto);


    if (validatedDto.file) {
      const result = await cloudinary.uploader.upload(validatedDto.file.path, {
        folder: "users",
        public_id: `user_${userId}_${Date.now()}`,
        type: "authenticated",
      });
      validatedDto.image = getSignedImageURL(result.public_id, result.format, 600);
    }


    const existingUser = await this._userRepository.findUserById(userId);
    if (!existingUser) throw new Error(Messages.USER_NOT_FOUND);

    const isFirstCompletion =
      !existingUser.profileCompletion &&
      validatedDto.name &&
      validatedDto.email &&
      validatedDto.phone &&
      validatedDto.dateOfBirth &&
      validatedDto.gender &&
      validatedDto.bloodGroup &&
      validatedDto.address &&
      validatedDto.image;


    const updates: Record<string, unknown> = {
      name: validatedDto.name,
      email: validatedDto.email,
      phone: validatedDto.phone,
      gender: validatedDto.gender,
      bloodGroup: validatedDto.bloodGroup,
      address: validatedDto.address,
      image: validatedDto.image,
      profileCompletion: isFirstCompletion ? true : existingUser.profileCompletion,
      age: validatedDto.age !== undefined ? String(validatedDto.age) : undefined,
      dateOfBirth: validatedDto.dateOfBirth ? new Date(validatedDto.dateOfBirth) : undefined,
    };


    const updatedUser = await this._userRepository.updateUserProfile(userId, updates);

    return plainToInstance(UpdateUserProfileResponseDTO, updatedUser);
  }
}
