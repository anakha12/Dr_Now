
import type { Doctor } from "./doctor";

export interface Specialization {
  id: string;
  Departmentname: string;
}

export interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  specializationFilter: string;
  setSpecializationFilter: (value: string) => void;
  feeFilter: number;
  setFeeFilter: (value: number) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
  specializations: Specialization[];
}

export interface DoctorCardsProps {
  doctors: Doctor[];
  page: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
  navigate: (path: string) => void;
}