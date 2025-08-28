import { DoctorEntity } from "../entities/doctorEntity";
import { Slot } from "../entities/doctorEntity";


export interface IDoctorRepository {
  findByEmail(email: string): Promise<DoctorEntity | null>;
  createDoctor(doctor: Partial< DoctorEntity>): Promise<DoctorEntity>;
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
  completeProfile(
  doctorId: string,
  profileData: {
    bio: string;
    education: { degree: string; institution: string; year: string }[];
    awards: string[];
    experience: { hospital: string; role: string; years: string }[];
    affiliatedHospitals: string[];
  }
): Promise<DoctorEntity>;

  getFilteredDoctors(
  filters: {
    search?: string;
    specialization?: string;
    maxFee?: number;
    gender?: string;
  },
  skip: number,
  limit: number
): Promise<DoctorEntity[]>;

countFilteredDoctors(filters: {
  search?: string;
  specialization?: string;
  maxFee?: number;
  gender?: string;
}): Promise<number>;
getPaginatedDoctors(skip: number, limit: number, search?: string): Promise<DoctorEntity[]>;
countDoctors(): Promise<number>;

getUnverifiedDoctorsPaginated(skip: number, limit: number): Promise<DoctorEntity[]>;
countUnverifiedDoctors(): Promise<number>;


}
