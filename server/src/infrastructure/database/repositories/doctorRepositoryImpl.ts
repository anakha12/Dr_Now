import DoctorModel, { IDoctor } from "../../database/models/doctorModel";
import { DoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";
import { Slot } from "../../database/models/doctorModel";
import BookingModel from "../../database/models/bookingModel";

export class DoctorRepositoryImpl implements DoctorRepository {

  async completeProfile(doctorId: string, profileData: any): Promise<any> {
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
  console.log("updated",updated)
  if (!updated) throw new Error("Doctor not found");

  return this.toDomain(updated); 
}


  async getDoctorById(id: string): Promise<DoctorEntity> {
    const doctor = await DoctorModel.findById(id);
    if (!doctor) throw new Error("Doctor not found");
    return this.toDomain(doctor);
  }


  async creditWallet(doctorId: string, tx: { amount: number; description: string; date: Date }): Promise<void> {
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
      type: 'credit', 
      date: tx.date,
    });

    await doctor.save();
  }



  async removeAllSlotsOnDate(doctorId: string, date: string): Promise<void> {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");
    doctor.availability = doctor.availability.filter(
      (entry: any) => entry.date !== date
    );

    await doctor.save();
  }

  async checkIfAnySlotBooked(doctorId: string, date: string, slots: Slot[]): Promise<boolean> {
    for (const slot of slots) {
      const existingBooking = await BookingModel.findOne({
        doctorId,
        date,
        "slot.from": slot.from,
        "slot.to": slot.to,
        status: { $in: ["Upcoming", "Completed"] },
      });

      if (existingBooking) {
        return true; 
      }
    }

  return false; 
}


async updateBlockedStatus(id: string, isBlocked: boolean): Promise<void> {
  await DoctorModel.findByIdAndUpdate(id, { isBlocked });
}

  async getAllDoctors(): Promise<DoctorEntity[]> {
  const doctors = await DoctorModel.find({});
  return doctors.map(doc => this.toDomain(doc));
}

  async findById(id: string): Promise<DoctorEntity | null> {
    return await DoctorModel.findById(id);
  }

  async findUnverifiedDoctors(): Promise<DoctorEntity[]> {
    const unverifiedDoctors = await DoctorModel.find({ isVerified: false,isRejected: false });
    return unverifiedDoctors.map(doc => this.toDomain(doc));
  }

  async findByEmail(email: string): Promise<DoctorEntity | null> {
    const doctor = await DoctorModel.findOne({ email });
    return doctor ? this.toDomain(doctor) : null;
  }

  async createDoctor(doctor: DoctorEntity): Promise<DoctorEntity> {
    const persistenceDoctor = this.toPersistence(doctor);
    const created = await DoctorModel.create(persistenceDoctor);
    return this.toDomain(created);
  }

  async updateDoctor(id: string, updates: Partial<DoctorEntity>): Promise<DoctorEntity> {
    const updated = await DoctorModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) throw new Error("Doctor not found");
    return this.toDomain(updated);
  }

  async addAvailability(
    doctorId: string,
    payload: { date: string; slots: Slot[] }
  ): Promise<void> {
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      throw new Error("Doctor not found");
    }
    if (!Array.isArray(doctor.availability)) {
      doctor.availability = [];
    }
    doctor.availability.push(payload);

    await doctor.save();
  }

  async removeSlot(doctorId: string, date: string, slot: Slot): Promise<void> {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const availabilityEntry = doctor.availability.find((entry: any) => entry.date === date);
    if (!availabilityEntry) throw new Error("Date not found in availability");

    availabilityEntry.slots = availabilityEntry.slots.filter(
      (s: any) => !(s.from === slot.from && s.to === slot.to)
    );

    if (availabilityEntry.slots.length === 0) {
      doctor.availability = doctor.availability.filter((entry: any) => entry.date !== date);
    }

    await doctor.save();
  }




  private toPersistence(entity: DoctorEntity): Partial<IDoctor> {
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
    };
  }

  private toDomain(doc: any): DoctorEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
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
    };
  }
}
