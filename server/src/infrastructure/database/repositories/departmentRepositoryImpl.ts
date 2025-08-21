import { Types } from "mongoose";
import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import DepartmentModel, { IDepartment } from "../models/departmentModel";
import { DepartmentEntity } from "../../../domain/entities/department.entity";

export class DepartmentRepositoryImpl implements IDepartmentRepository {

  private _toDomain(dep: IDepartment): DepartmentEntity {
    return {
      id: dep._id.toString(),
      Departmentname: dep.Departmentname,
      Description: dep.Description,
      status: dep.status,
      createdAt: dep.createdAt,
      updatedAt: dep.updatedAt,
    };
  }

  async getPaginatedDepartments(page: number, limit: number, search: string): Promise<{ departments: DepartmentEntity[], totalPages: number }> {
    const skip = (page - 1) * limit;
    const searchFilter= search
      ? {
        Departmentname:{$regex: search, $options:'i'},
      }:{};
    const totalDepartments = await DepartmentModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDepartments / limit);

    const departments = await DepartmentModel.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      departments: departments.map(this._toDomain),
      totalPages,
    };
  }


  async findByName(name: string): Promise<DepartmentEntity | null> {
    const dep = await DepartmentModel.findOne({ Departmentname: name });
    return dep ? this._toDomain(dep) : null;
  }

  async createDepartment(data: DepartmentEntity): Promise<DepartmentEntity> {
    const created = await DepartmentModel.create(data);
    return this._toDomain(created);
  }

  async getDepartments(page: number, limit: number): Promise<DepartmentEntity[]> {
    const skip = (page - 1) * limit;
    const departments = await DepartmentModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return departments.map(this._toDomain);
  }

  async toggleDepartmentStatus(id: string, status: 'Listed' | 'Unlisted'): Promise<void> {
    await DepartmentModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { status },
      { new: true }
    );
  }
}
