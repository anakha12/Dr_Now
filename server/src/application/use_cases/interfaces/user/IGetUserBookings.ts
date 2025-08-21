export interface IGetUserBookings {
  execute(userId: string, page: number, limit: number): Promise<{ bookings: any[]; totalPages: number }>;
}
    