import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IUpdateDoctorProfile } from "../interfaces/doctor/IUpdateDoctorProfile";
import { AppError } from "../../../utils/AppError";
import { UpdateDoctorProfileDTO } from "../../../interfaces/dto/request/update-doctorProfile.dto";
import { Messages, ErrorMessages } from "../../../utils/Messages";
import { BaseUseCase } from "../base-usecase";

export class UpdateDoctorProfile extends BaseUseCase<
  UpdateDoctorProfileDTO,
  { message: string } | { success: boolean; updatedDoctor: Record<string, unknown> }
> implements IUpdateDoctorProfile {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _bookingRepository: IBookingRepository
  ) {
    super();
  }

  async execute(
    dto: UpdateDoctorProfileDTO
  ): Promise<{ message: string } | { success: boolean; updatedDoctor: Record<string, unknown> }> {
    const validatedDto = await this.validateDto(UpdateDoctorProfileDTO, dto);

    const { doctorId, confirm, ...updates } = validatedDto;

    if (!confirm) {
      return { message: Messages.PROFILE_CONFIRMATION_REQUIRED };
    }

    const finalUpdates = {
      ...updates,
      consultFee: String(updates.consultFee || ""),
      isVerified: false,
      education:
        updates.education?.map((e) => ({
          degree: e.degree,
          institution: e.institution,
          year: e.year,
        })) || [],
      experience:
        updates.experience?.map((exp) => ({
          hospital: exp.hospital,
          role: exp.role,
          years: exp.years,
        })) || [],
    };

    const updatedDoctor = await this._doctorRepository.updateDoctor(doctorId, finalUpdates);

    if (!updatedDoctor) {
      throw new AppError(ErrorMessages.PROFILE_UPDATE_FAILED, 500);
    }

    return { success: true, updatedDoctor: JSON.parse(JSON.stringify(updatedDoctor)) };
  }
}
