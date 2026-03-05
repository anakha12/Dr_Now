
import { PrescriptionController } from "../interfaces/controllers/prescriptionController";
import { AddPrescriptionUseCase } from "../application/use_cases/doctor/addPrescriptionUsecase";
import { PrescriptionRepositoryImpl } from "../infrastructure/database/repositories/prescriptionRepositoryImpl";

const prescriptionRepo = new PrescriptionRepositoryImpl();
const addPrescriptionUseCase = new AddPrescriptionUseCase(prescriptionRepo);

const prescriptionController = new PrescriptionController(addPrescriptionUseCase);

export { prescriptionController, addPrescriptionUseCase };