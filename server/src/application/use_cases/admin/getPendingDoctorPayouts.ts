import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IGetPendingDoctorPayoutsUseCase } from "../interfaces/admin/IGetPendingDoctorPayoutsUseCase";

export class GetPendingDoctorPayouts implements IGetPendingDoctorPayoutsUseCase{
  constructor(private _bookingRepo: IBookingRepository) {}

  async execute(page: number, limit: number) {
    return await this._bookingRepo.getDoctorsWithPendingEarnings(page, limit);
  }
}
