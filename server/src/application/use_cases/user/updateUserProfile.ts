import { IUpdateUserProfileUseCase } from "../interfaces/user/IUpdateUserProfile";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UpdateUserProfileDto } from "../../../interfaces/dto/response/user/updateUserProfile.dto";
import { UserEntity } from "../../../domain/entities/userEntity";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { cloudinary } from "../../../config/cloudinary";
import { Messages } from "../../../utils/Messages";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, data: UpdateUserProfileDto): Promise<UserEntity> {
    
    if ((data as any).file) {
      const file = (data as any).file as Express.Multer.File;
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "users",
        public_id: `user_${userId}_${Date.now()}`,
      });
      data.image = result.secure_url;
    }

    const dto = plainToInstance(UpdateUserProfileDto, data);
    await validateOrReject(dto);

    const existingUser = await this.userRepository.findUserById(userId);
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

    return this.userRepository.updateUser(userId, updates);
  }
}
