export interface AvailabilityRule {
  _id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}