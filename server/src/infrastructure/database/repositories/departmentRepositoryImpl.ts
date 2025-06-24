import { Types } from "mongoose";
import { DepartmentRepository } from "../../../domain/repositories/departmentRepository";
import DepartmentModel, { IDepartment } from "../models/departmentModel";
import { DepartmentEntity } from "../../../domain/entities/department.entity";

export class DepartmentRepositoryImpl implements DepartmentRepository {

  async findByName(name: string): Promise<DepartmentEntity | null> {
    const dep = await DepartmentModel.findOne({ Departmentname: name });
    if (!dep) return null;

    return {
      id: dep._id.toString(),
      Departmentname: dep.Departmentname,
      Description: dep.Description,
      status: dep.status,
      createdAt: dep.createdAt,
      updatedAt: dep.updatedAt,
    };
  }
  
  async createDepartment(data: DepartmentEntity): Promise<DepartmentEntity> {
    const created: IDepartment = await DepartmentModel.create(data);

    return {
      id: created._id.toString(),
      Departmentname: created.Departmentname,
      Description: created.Description,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  // Fetch departments with pagination
  async getDepartments(page: number, limit: number): Promise<DepartmentEntity[]> {
    const skip = (page - 1) * limit;

    const departments: IDepartment[] = await DepartmentModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return departments.map((dep) => ({
      id: dep._id.toString(),
      Departmentname: dep.Departmentname,
      Description: dep.Description,
      status: dep.status,
      createdAt: dep.createdAt,
      updatedAt: dep.updatedAt,
    }));
  }

  // Toggle List/Unlist department
  async toggleDepartmentStatus(id: string, status: 'Listed' | 'Unlisted'): Promise<void> {
    await DepartmentModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { status },
      { new: true }
    );
  }
}
