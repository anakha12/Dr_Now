import { DoctorEntity } from "../entities/doctorEntity";
import { Slot } from "../entities/doctorEntity";


export interface DoctorRepository {
  findByEmail(email: string): Promise<DoctorEntity | null>;
  createDoctor(doctor: DoctorEntity): Promise<DoctorEntity>;
  updateDoctor(id: string, updates: Partial<DoctorEntity>): Promise<DoctorEntity>;
  findUnverifiedDoctors(): Promise<DoctorEntity[]>;
  findById(id: string): Promise<DoctorEntity | null>;
  getAllDoctors(): Promise<DoctorEntity[]>;
  updateBlockedStatus(id: string, isBlocked: boolean): Promise<void>;
  addAvailability(doctorId: string, payload: { date: string; slots: Slot[] }): Promise<void>;
  removeSlot(doctorId: string, date: string, slot: Slot): Promise<void>;
  checkIfAnySlotBooked(doctorId: string, date: string, slots: Slot[]): Promise<boolean>;
  removeAllSlotsOnDate(doctorId: string, date: string): Promise<void>;
  creditWallet(doctorId: string,tx: { amount: number; description: string; date: Date }): Promise<void>;
  getDoctorById(id: string): Promise<DoctorEntity>;

}
