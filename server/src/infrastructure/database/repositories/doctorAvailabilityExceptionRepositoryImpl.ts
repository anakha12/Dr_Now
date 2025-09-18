
import DoctorAvailabilityExceptionModel, { IDoctorAvailabilityException } from "../../database/models/availabilityException.model";
import { IDoctorAvailabilityExceptionRepository } from "../../../domain/repositories/IDoctorAvailabilityExceptionRepository ";
import { DoctorAvailabilityException } from "../../../domain/entities/doctorAvailabilityException.entity";
import mongoose from "mongoose";

export class DoctorAvailabilityExceptionRepositoryImpl 
  implements IDoctorAvailabilityExceptionRepository {
  
  async createException(exception: Partial<DoctorAvailabilityException>): Promise<DoctorAvailabilityException> {
    const created = await DoctorAvailabilityExceptionModel.create(exception);
    return this._toDomain(created);
  }

  async getExceptionsForDoctor(doctorId: string): Promise<DoctorAvailabilityException[]> {
    const docs = await DoctorAvailabilityExceptionModel.find({ doctorId });
    return docs.map((doc) => this._toDomain(doc));
  }

  async deleteException(id: string): Promise<boolean> {
    const result = await DoctorAvailabilityExceptionModel.findByIdAndDelete(id);
    return !!result; 
  }
  private _toDomain(doc: IDoctorAvailabilityException): DoctorAvailabilityException {
    return new DoctorAvailabilityException(
      String(doc.doctorId),
      doc.date,
      doc.isAvailable,
      doc.startTime,
      doc.endTime,
      doc.slotDuration,
      doc._id ? String(doc._id) : undefined
    );
  }
}
