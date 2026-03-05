export interface ICompleteBookingUseCase {
  execute(bookingId: string, doctorId: string): Promise<void>;
}