import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IUpdateDoctorProfile } from "../interfaces/doctor/IUpdateDoctorProfile";

export class UpdateDoctorProfile implements IUpdateDoctorProfile{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(doctorId: string, updates: any) {
    const hasActiveBookings = await this._bookingRepository.hasActiveBookingsForDoctor(doctorId);
    
    if (hasActiveBookings) {
      throw new Error("You cannot update your profile while bookings exist.");
    }

   
    if (!updates.confirm) {
      return { message: "confirmation_required" };
    }

    const updated = await this._doctorRepository.updateDoctor(doctorId, {
      ...updates,
      isVerified: false,
    });

    if (!updated) throw new Error("Failed to update profile");
    return updated;
  }
}
