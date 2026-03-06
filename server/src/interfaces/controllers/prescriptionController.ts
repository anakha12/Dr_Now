
import { Request, Response } from "express";
import { IAddPrescriptionUseCase } from "../../application/use_cases/interfaces/doctor/IAddPrescriptionUsecase";
import { HttpStatus } from "../../utils/HttpStatus";
import { handleControllerError } from "../../utils/errorHandler";

export class PrescriptionController {
  constructor(private readonly _addPrescriptionUseCase: IAddPrescriptionUseCase) {}

  async addPrescription(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.bookingId;
      const prescriptionData = req.body;

      const response = await this._addPrescriptionUseCase.execute({
        ...prescriptionData,
        bookingId,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: response,
      });

    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }
}