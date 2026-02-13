import { Request, Response } from "express";
import { Messages } from "../../utils/Messages";
import { HttpStatus } from "../../utils/HttpStatus";
import { handleControllerError } from "../../utils/errorHandler";

import { ILoginAdmin } from "../../application/use_cases/interfaces/admin/ILoginAdmin";
import { IGetUnverifiedDoctors } from "../../application/use_cases/interfaces/admin/IGetUnverifiedDoctors";
import { IVerifyDoctorUseCase } from "../../application/use_cases/interfaces/admin/IVerifyDoctorUseCase";
import { IRejectDoctorUseCase } from "../../application/use_cases/interfaces/admin/IRejectDoctorUseCase";
import { IToggleBlockDoctor } from "../../application/use_cases/interfaces/admin/IToggleBlockDoctor";
import { IGetAllUsersUseCase } from "../../application/use_cases/interfaces/admin/IGetAllUsers";
import { IToggleUserBlockStatusUseCase } from "../../application/use_cases/interfaces/admin/IToggleUserBlockStatusUseCase";
import { ICreateDepartmentUseCase } from "../../application/use_cases/interfaces/admin/ICreateDepartmentUseCase";
import { IGetDepartmentsUseCase } from "../../application/use_cases/interfaces/admin/IGetDepartmentsUseCase";
import { IToggleDepartmentStatusUseCase } from "../../application/use_cases/interfaces/admin/IToggleDepartmentStatusUseCase";
import { IGetPendingDoctorPayoutsUseCase } from "../../application/use_cases/interfaces/admin/IGetPendingDoctorPayoutsUseCase";
import { IGetWalletSummaryUseCase } from "../../application/use_cases/interfaces/admin/IGetWalletSummaryUseCase";
import { IPayoutDoctorUseCase } from "../../application/use_cases/interfaces/admin/IPayoutDoctorUseCase";
import { IGetAllDoctorsUseCase } from "../../application/use_cases/interfaces/admin/IGetAllDoctors";
import { IGetDoctorByIdUseCase } from "../../application/use_cases/interfaces/admin/IGetDoctorById";

  export class AdminController {
    
    constructor(
      private _loginAdmin: ILoginAdmin,
      private _getUnverifiedDoctorsUseCase: IGetUnverifiedDoctors,
      private _verifyDoctorUseCase: IVerifyDoctorUseCase,
      private _rejectDoctorUseCase: IRejectDoctorUseCase,
      private _getAllDoctorsUseCase: IGetAllDoctorsUseCase,
      private _toggleBlockDoctorUseCase: IToggleBlockDoctor,
      private _getAllUsersUseCase:IGetAllUsersUseCase,
      private _toggleUserBlockStatusUseCase:IToggleUserBlockStatusUseCase,
      private _createDepartmentUseCase: ICreateDepartmentUseCase,
      private _getDepartmentsUseCase: IGetDepartmentsUseCase,
      private _toggleDepartmentStatusUseCase: IToggleDepartmentStatusUseCase,
      private _getPendingDoctorPayoutsUseCase: IGetPendingDoctorPayoutsUseCase,
      private _getWalletSummaryUseCase: IGetWalletSummaryUseCase,
      private _payoutDoctorUseCase: IPayoutDoctorUseCase,
      private _getDoctorByIdUseCase: IGetDoctorByIdUseCase

    ) {
    
    }

    async adminLogin(req: Request, res: Response): Promise<void> {
      try {

        const response = await this._loginAdmin.execute(req.body);

        res.cookie("userAccessToken", response.accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAXAGE),
        });

        res.cookie("refreshToken", response.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAXAGE),
        });

        res.status(HttpStatus.OK).json({ message: Messages.LOGIN_SUCCESSFUL, user: response.user });
        } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.UNAUTHORIZED);
      }
    }

    async getUnverifiedDoctors(req: Request, res: Response): Promise<void> {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const { doctors, total } = await this._getUnverifiedDoctorsUseCase.execute(page, limit);

        res.status(HttpStatus.OK).json({
          doctors,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        });
        } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


    async verifyDoctor(req: Request, res: Response): Promise<void> {
      try {
        const doctorId = req.params.id;
        await this._verifyDoctorUseCase.execute(doctorId);
        res.status(HttpStatus.OK).json({ message: Messages.DOCTOR_VERIFIED});
        } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    async rejectDoctor(req: Request, res: Response): Promise<void> {
      try {
        const doctorId = req.params.id;
        const { reason } = req.body;
        await this._rejectDoctorUseCase.execute(doctorId, reason);
        res.status(HttpStatus.OK).json({ message: Messages.DOCTOR_REJECTED });
        } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


    async getAllDoctors(req: Request, res: Response): Promise<void> {
      try {
       
        const result = await this._getAllDoctorsUseCase.execute(req.query);
        res.status(HttpStatus.OK).json(result);
      } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


    async toggleDoctorBlockStatus(req: Request, res: Response): Promise<void> {
      try {
        const { id, action } = req.params;

        if (!["block", "unblock"].includes(action)) {
          res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_ACTION });
          return;
        }

        await this._toggleBlockDoctorUseCase.execute(id, action as "block" | "unblock");
        res.status(HttpStatus.OK).json({ 
          message: action === "block" 
            ? Messages.DOCTOR_BLOCKED 
            : Messages.DOCTOR_UNBLOCKED 
        });

        } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

async getAllUsers(req: Request, res: Response): Promise<void> {
  try {

    const result = await this._getAllUsersUseCase.execute(req.query);

    res.status(HttpStatus.OK).json(result);

  } catch (err: unknown) {
    handleControllerError(res, err, HttpStatus.BAD_REQUEST);
  }
}


    async toggleUserBlockStatus(req: Request, res: Response): Promise<void> {
      try {
        const { id, action } = req.params;

        if (!["block", "unblock"].includes(action)) {
          res.status(HttpStatus.BAD_REQUEST).json({ message:Messages.INVALID_ACTION });
          return;
        }

        const shouldBlock = action === "block";
        await this._toggleUserBlockStatusUseCase.execute(id, shouldBlock);

        res.status(HttpStatus.OK).json({ 
          message: action === "block" 
            ? Messages.USER_BLOCKED 
            : Messages.USER_UNBLOCKED 
        });

        } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


    async createDepartment(req: Request, res: Response) {
      try {
        const dept = await this._createDepartmentUseCase.execute(req.body);
        res.status(HttpStatus.CREATED).json(dept);
        } catch (err: unknown) {
        handleControllerError(res, err, HttpStatus.BAD_REQUEST);
      }
    }

  async getDepartments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search=(req.query.search as string)|| "";
       const { departments, totalPages } = await this._getDepartmentsUseCase.execute({page, limit, search});
      res.status(HttpStatus.OK).json({ departments, totalPages });
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async toggleDepartmentStatus(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      await this._toggleDepartmentStatusUseCase.execute(id, status);
      res.status(HttpStatus.OK).json({ message: Messages.STATUS_UPDATED(status) });
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.BAD_REQUEST);
    }
  }

  async getPendingDoctors(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await this._getPendingDoctorPayoutsUseCase.execute(page, limit);

      return res.status(HttpStatus.OK).json(result);
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getWalletSummary(req: Request, res: Response) {
    try {
      const summary = await this._getWalletSummaryUseCase.execute();
      res.status(HttpStatus.OK).json(summary);
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async payoutDoctor(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.id;
      await this._payoutDoctorUseCase.execute(doctorId);
      res.status(HttpStatus.OK).json({ message: Messages.DOCTOR_PAYOUT_SUCCESS });
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDoctorById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doctor = await this._getDoctorByIdUseCase.execute(id);
      res.status(HttpStatus.OK).json(doctor);
    } catch (err: unknown) {
      handleControllerError(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  }
