import type { Doctor } from "./doctor";

export type FiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  specializationFilter: string;
  setSpecializationFilter: (value: string) => void;
  feeFilter: number;
  setFeeFilter: (value: number) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
  specializations: { id: string; Departmentname: string }[];
};

export type DoctorCardsProps = {
  doctors: Doctor[];
  page: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
  navigate: (path: string) => void;
};