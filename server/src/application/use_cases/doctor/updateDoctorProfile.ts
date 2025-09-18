import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IUpdateDoctorProfile } from "../interfaces/doctor/IUpdateDoctorProfile";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class UpdateDoctorProfile implements IUpdateDoctorProfile{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(doctorId: string, updates: any) {
    const hasActiveBookings = await this._bookingRepository.hasActiveBookingsForDoctor(doctorId);
    
    if (hasActiveBookings) {
      throw new Error( ErrorMessages.PROFILE_UPDATE_BLOCKED);
    }

   
    if (!updates.confirm) {
      return { message: Messages.PROFILE_CONFIRMATION_REQUIRED };
    }

    const updated = await this._doctorRepository.updateDoctor(doctorId, {
      ...updates,
      isVerified: false,
    });

    if (!updated) throw new Error( ErrorMessages.PROFILE_UPDATE_FAILED);
    return updated;
  }
}
