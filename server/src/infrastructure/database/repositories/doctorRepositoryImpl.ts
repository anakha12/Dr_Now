import DoctorModel, { IDoctor, Slot } from "../../database/models/doctorModel";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";
import BookingModel from "../models/booking.model";

export class DoctorRepositoryImpl implements IDoctorRepository {

async getPaginatedDoctors(skip: number, limit: number, search: string = ""): Promise<DoctorEntity[]> {
  const query: any = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const doctors = await DoctorModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return doctors.map(this._toDomain);
}





async getUnverifiedDoctorsPaginated(skip: number, limit: number): Promise<DoctorEntity[]> {
  const unverified = await DoctorModel.find({ isVerified: false, isRejected: false })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return unverified.map(this._toDomain);
}

async countUnverifiedDoctors(): Promise<number> {
  return await DoctorModel.countDocuments({ isVerified: false, isRejected: false });
}


async countDoctors(): Promise<number> {
  return await DoctorModel.countDocuments({});
}

async countFilteredDoctors(filters: {
  search?: string;
  specialization?: string;
  maxFee?: number;
  gender?: string;
}): Promise<number> {
  const query: any = {
    isVerified: true,
    isBlocked: false,
  };

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }

  if (filters.specialization) {
    query.specialization = filters.specialization;
  }

  if (filters.maxFee !== undefined) {
    query.$expr = { $lte: [{ $toDouble: "$consultFee" }, filters.maxFee] };
  }

  if (filters.gender) {
    query.gender = filters.gender;
  }

  return await DoctorModel.countDocuments(query);
}



 async getFilteredDoctors(
  filters: {
    search?: string;
    specialization?: string;
    maxFee?: number;
    gender?: string;
  },
  skip: number,
  limit: number
): Promise<DoctorEntity[]> {
  const query: any = {
    isVerified: true,
    isBlocked: false,
  };

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }

  if (filters.specialization) {
    query.specialization = filters.specialization;
  }

  if (filters.maxFee !== undefined) {
    query.$expr = { $lte: [{ $toDouble: "$consultFee" }, filters.maxFee] };
  }

  if (filters.gender) {
    query.gender = filters.gender;
  }

  const doctors = await DoctorModel.find(query).skip(skip).limit(limit).lean();
  return doctors.map(this._toDomain);
}



  async completeProfile(doctorId: string, profileData: any): Promise<DoctorEntity> {
    const updated = await DoctorModel.findByIdAndUpdate(
      doctorId,
      {
        $set: {
          bio: profileData.bio,
          education: profileData.education,
          awards: profileData.awards,
          experience: profileData.experience,
          affiliatedHospitals: profileData.affiliatedHospitals,
          isProfileComplete: true,
        },
      },
      { new: true }
    );

    if (!updated) throw new Error("Doctor not found");
    return this._toDomain(updated);
  }

  async getDoctorById(id: string): Promise<DoctorEntity> {
    const doctor = await DoctorModel.findById(id);
    if (!doctor) throw new Error("Doctor not found");
    return this._toDomain(doctor);
  }

  async creditWallet(
    doctorId: string,
    tx: { amount: number; description: string; date: Date }
  ): Promise<void> {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    doctor.walletBalance = doctor.walletBalance ?? 0;
    doctor.totalEarned = doctor.totalEarned ?? 0;
    doctor.walletTransactions = doctor.walletTransactions ?? [];

    doctor.walletBalance += tx.amount;
    doctor.totalEarned += tx.amount;

    doctor.walletTransactions.push({
      amount: tx.amount,
      reason: tx.description,
      type: "credit",
      date: tx.date,
    });

    await doctor.save();
  }

  async removeAllSlotsOnDate(doctorId: string, date: string): Promise<void> {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    doctor.availability = doctor.availability.filter((entry: any) => entry.date !== date);
    await doctor.save();
  }

  async checkIfAnySlotBooked(doctorId: string, date: string, slots: Slot[]): Promise<boolean> {
    for (const slot of slots) {
      const existing = await BookingModel.findOne({
        doctorId,
        date,
        "slot.from": slot.from,
        "slot.to": slot.to,
        status: { $in: ["Upcoming", "Completed"] },
      });
      if (existing) return true;
    }
    return false;
  }

  async updateBlockedStatus(id: string, isBlocked: boolean): Promise<void> {
    await DoctorModel.findByIdAndUpdate(id, { isBlocked });
  }

  async getAllDoctors(): Promise<DoctorEntity[]> {
    const doctors = await DoctorModel.find({});
    return doctors.map(this._toDomain);
  }

  async findById(id: string): Promise<DoctorEntity | null> {
    const doctor = await DoctorModel.findById(id).lean();
    return doctor ? this._toDomain(doctor) : null;
  }

  async findUnverifiedDoctors(): Promise<DoctorEntity[]> {
    const unverified = await DoctorModel.find({ isVerified: false, isRejected: false });
    return unverified.map(this._toDomain);
  }

  async findByEmail(email: string): Promise<DoctorEntity | null> {
    const doctor = await DoctorModel.findOne({ email });
    return doctor ? this._toDomain(doctor) : null;
  }

  async createDoctor(doctor: DoctorEntity): Promise<DoctorEntity> {
    const persistenceDoctor = this._toPersistence(doctor);
    const created = await DoctorModel.create(persistenceDoctor);
    return this._toDomain(created);
  }

  async updateDoctor(id: string, updates: Partial<DoctorEntity>): Promise<DoctorEntity> {
    const updated = await DoctorModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) throw new Error("Doctor not found");
    return this._toDomain(updated);
  }

  async addAvailability(
    doctorId: string,
    payload: { date: string; slots: Slot[] }
  ): Promise<void> {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    doctor.availability = doctor.availability ?? [];
    doctor.availability.push(payload);
    await doctor.save();
  }

  async removeSlot(doctorId: string, date: string, slot: Slot): Promise<void> {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const entry = doctor.availability.find((a: any) => a.date === date);
    if (!entry) throw new Error("Date not found in availability");

    entry.slots = entry.slots.filter((s: any) => s.from !== slot.from || s.to !== slot.to);

    if (entry.slots.length === 0) {
      doctor.availability = doctor.availability.filter((a: any) => a.date !== date);
    }

    await doctor.save();
  }

  private _toPersistence(entity: DoctorEntity): Partial<IDoctor> {
    return {
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      yearsOfExperience: entity.yearsOfExperience,
      specialization: entity.specialization,
      password: entity.password,
      isVerified: entity.isVerified,
      isActive: entity.isActive,
      profileImage: entity.profileImage,
      medicalLicense: entity.medicalLicense,
      idProof: entity.idProof,
      gender: entity.gender,
      consultFee: entity.consultFee,
      isBlocked: entity.isBlocked,
      otp: entity.otp,
      otpExpiresAt: entity.otpExpiresAt,
      availability: entity.availability,
      age: entity.age,
    };
  }

  private _toDomain(doc: any): DoctorEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      age: doc.age,
      yearsOfExperience: doc.yearsOfExperience,
      specialization: doc.specialization,
      password: doc.password,
      isVerified: doc.isVerified,
      isActive: doc.isActive,
      profileImage: doc.profileImage,
      medicalLicense: doc.medicalLicense,
      idProof: doc.idProof,
      gender: doc.gender,
      consultFee: doc.consultFee,
      isBlocked: doc.isBlocked,
      otp: doc.otp,
      otpExpiresAt: doc.otpExpiresAt,
      availability: doc.availability,
      isRejected: doc.isRejected,
      walletBalance: doc.walletBalance,
      walletTransactions: doc.walletTransactions,
      totalEarned: doc.totalEarned,
      bio: doc.bio,
      education: doc.education,
      awards: doc.awards,
      experience: doc.experience,
      affiliatedHospitals: doc.affiliatedHospitals,
      role: doc.role
    };
  }
}
