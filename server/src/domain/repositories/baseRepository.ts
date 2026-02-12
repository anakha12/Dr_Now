import { Model, Document } from "mongoose";

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    const doc = new this.model(item);
    return doc.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async updateById(id: string, updates: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updates, { new: true });
  }

  async findAll(filter: Record<string, unknown> = {}, sort: Record<string, 1 | -1> = { createdAt: -1 }, skip = 0, limit = 0): Promise<T[]> {
    const query = this.model.find(filter).sort(sort);
    if (skip) query.skip(skip);
    if (limit) query.limit(limit);
    return query;
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
