import { IUpdateUserProfileUseCase } from "../interfaces/user/IUpdateUserProfile";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UpdateUserProfileDto } from "../../../interfaces/dto/response/user/updateUserProfile.dto";
import { UserEntity } from "../../../domain/entities/userEntity";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { cloudinary, getSignedImageURL } from "../../../config/cloudinary";
import { Messages } from "../../../utils/Messages";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string, data: UpdateUserProfileDto): Promise<UserEntity> {
    
        if (data.file) {
          const file = data.file;
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "users",
            public_id: `user_${userId}_${Date.now()}`,
            type: "authenticated",
          });

          const publicId = result.public_id;
          const format = result.format;
          data.image = getSignedImageURL(publicId, format, 600);
        }

    const dto = plainToInstance(UpdateUserProfileDto, data);
    await validateOrReject(dto);

    const existingUser = await this._userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error(Messages.USER_NOT_FOUND);
    }
    const isFirstCompletion =
      !existingUser.profileCompletion &&
      dto.name &&
      dto.email &&
      dto.phone &&
      dto.dateOfBirth &&
      dto.gender &&
      dto.bloodGroup &&
      dto.age &&
      dto.address &&
      dto.image;

    const updates: Partial<UserEntity> = {
      ...dto,
      age: dto.age !== undefined ? String(dto.age) : undefined,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      profileCompletion: isFirstCompletion ? true : existingUser.profileCompletion,
    };

    return this._userRepository.updateUser(userId, updates);
  }
}
