export class Review {
  constructor(
    public doctorId: string,
    public userId: string,
    public bookingId: string,
    public rating: number,
    public comment: string,
    public id?: string,
    public createdAt: Date = new Date()
  ) {}
}
