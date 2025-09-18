import { IAvailabilityRuleRepository } from "../../../domain/repositories/IAvailabilityRuleRepository";
import DoctorAvailabilityRuleModel, { IDoctorAvailabilityRule } from "../../database/models/availabilityRule.model";
import { DoctorAvailabilityRule } from "../../../domain/entities/doctorAvailabilityRule.entity";
import mongoose from "mongoose";
import { ErrorMessages } from "../../../utils/Messages";

export class AvailabilityRuleRepositoryImpl implements IAvailabilityRuleRepository {
  async findByDoctorAndDay(
    doctorId: string,
    dayOfWeek: number
  ): Promise<DoctorAvailabilityRule | null> {
    const doc = await DoctorAvailabilityRuleModel.findOne({ doctorId, dayOfWeek }).exec();
    return doc ? this._toDomain(doc) : null;
  } 

  async create(rule: DoctorAvailabilityRule): Promise<DoctorAvailabilityRule> {
    const created = await DoctorAvailabilityRuleModel.create({
      doctorId: rule.doctorId,
      dayOfWeek: rule.dayOfWeek,
      startTime: rule.startTime,
      endTime: rule.endTime,
      slotDuration: rule.slotDuration,
    });
    return this._toDomain(created);
  }

  async delete(ruleId: string): Promise<void> {
    await DoctorAvailabilityRuleModel.findByIdAndDelete(ruleId).exec();
  }

  async findByDoctor(doctorId: string): Promise<DoctorAvailabilityRule[]> {
    const docs = await DoctorAvailabilityRuleModel.find({ doctorId }).exec();
    return docs.map((d) => this._toDomain(d));
  }

  async update(rule: DoctorAvailabilityRule): Promise<DoctorAvailabilityRule> {
  const updated = await DoctorAvailabilityRuleModel.findOneAndUpdate(
    { doctorId: rule.doctorId, dayOfWeek: rule.dayOfWeek }, 
    {
      startTime: rule.startTime,
      endTime: rule.endTime,
      slotDuration: rule.slotDuration,
    },
    { new: true } 
  ).exec();

  if (!updated) {
    throw new Error( ErrorMessages.RULE_NOT_FOUND);
  }

  return this._toDomain(updated);
}

  

  private _toDomain(doc: IDoctorAvailabilityRule): DoctorAvailabilityRule {
    return new DoctorAvailabilityRule(
      doc.doctorId.toString(),
      doc.dayOfWeek,
      doc.startTime,
      doc.endTime,
      doc.slotDuration,
      (doc._id as mongoose.Types.ObjectId).toString()
    );
  }
}
