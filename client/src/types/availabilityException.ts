export interface AvailabilityException {
  _id?: string;
  doctorId: string;
  date: string;
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
}