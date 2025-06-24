import mongoose, { Schema, Document, Types  } from 'mongoose';

export interface IDepartment extends Document {
  _id: Types.ObjectId;
  Departmentname: string;
  status?: 'Listed' | 'Unlisted';
  Description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepartmentSchema: Schema<IDepartment> = new Schema(
  {
    Departmentname: {
      type: String,
      required: true,
      set: function (value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
    },
    status: {
      type: String,
      default: 'Listed',
      enum: ['Listed', 'Unlisted']
    },
    Description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model<IDepartment>('Department', DepartmentSchema);
