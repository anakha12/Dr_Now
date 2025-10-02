  import { Request, Response } from "express";
  import { Messages } from "../../utils/Messages";
  import { HttpStatus } from "../../utils/HttpStatus";

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
import { plainToInstance } from "class-transformer";
import { DepartmentRegisterDTO } from "../dto/request/department-register.dto";
import { validate } from "class-validator";
import { AdminLoginDTO } from "../dto/request/admin-login.dto";


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

    ) {
    
    }

    async adminLogin(req: Request, res: Response): Promise<void> {
      try {
        const dto=plainToInstance(AdminLoginDTO, req.body);

        const { accessToken,refreshToken, user } = await this._loginAdmin.execute(dto);
        
        if (user.role !== "admin") {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
          return;
        }

        const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_COOKIE_MAXAGE);
        const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_COOKIE_MAXAGE);

        res.cookie("userAccessToken", accessToken, {
          httpOnly: true,
          secure: false, 
          sameSite: "lax",
          maxAge: accessTokenMaxAge,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: refreshTokenMaxAge, 
        });
        res.status(HttpStatus.OK).json({ message: Messages.LOGIN_SUCCESSFUL, user });
      } catch (err: any) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: err.message });
      }
    }

    async getUnverifiedDoctors(req: Request, res: Response): Promise<void> {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const { doctors, total } = await this._getUnverifiedDoctorsUseCase.execute(page, limit);

        res.status(200).json({
          doctors,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        });
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }


    async verifyDoctor(req: Request, res: Response): Promise<void> {
      try {
        const doctorId = req.params.id;
        await this._verifyDoctorUseCase.execute(doctorId);
        res.status(HttpStatus.OK).json({ message: Messages.DOCTOR_VERIFIED});
      } catch (err: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
      }
    }

    async rejectDoctor(req: Request, res: Response): Promise<void> {
      try {
        const doctorId = req.params.id;
        const { reason } = req.body;
        await this._rejectDoctorUseCase.execute(doctorId, reason);
        res.status(HttpStatus.OK).json({ message: Messages.DOCTOR_REJECTED });
      } catch (err: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
      }
    }

    async getAllDoctors(req: Request, res: Response): Promise<void> {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const search= (req.query.search as string)|| "";
        const { doctors, totalDoctors } = await this._getAllDoctorsUseCase.execute(page, limit, search);

        res.status(200).json({
          doctors,
          totalPages: Math.ceil(totalDoctors / limit),
          currentPage: page,
        });
      } catch (err: any) {
        res.status(500).json({ message: err.message });
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

      } catch (err: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
      }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
      try {
        const page = parseInt(req.query.page as string) || 1;
       const limit = parseInt(req.query.limit as string) || 5;
       const search=(req.query.search as string)|| "";

        const users = await this._getAllUsersUseCase.execute(page, limit, search);
        res.status(HttpStatus.OK).json(users);
      } catch (err: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
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

      } catch (err: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
      }
    }


    async createDepartment(req: Request, res: Response) {
    try {
      const dto= plainToInstance(DepartmentRegisterDTO,req.body);

      const errors = await validate(dto);

      if (errors.length > 0) {
        const formattedErrors = errors.reduce((acc, err) => {
          if (err.constraints) {
            acc[err.property] = Object.values(err.constraints)[0]; 
          }
         
          return acc;
        }, {} as Record<string, string>);

         return res.status(400).json({ errors:formattedErrors });
      }
      const dept = await this._createDepartmentUseCase.execute(dto);
      res.status(HttpStatus.CREATED).json(dept);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getDepartments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search=(req.query.search as string)|| "";
       const { departments, totalPages } = await this._getDepartmentsUseCase.execute(page, limit, search);
      res.status(HttpStatus.OK).json({ departments, totalPages });
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async toggleDepartmentStatus(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      await this._toggleDepartmentStatusUseCase.execute(id, status);
      res.status(HttpStatus.OK).json({ message: Messages.STATUS_UPDATED(status) });
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getPendingDoctors(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await this._getPendingDoctorPayoutsUseCase.execute(page, limit);

      return res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }


  async getWalletSummary(req: Request, res: Response) {
    try {
      const summary = await this._getWalletSummaryUseCase.execute();
      res.status(HttpStatus.OK).json(summary);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async payoutDoctor(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.id;
      await this._payoutDoctorUseCase.execute(doctorId);
      res.status(HttpStatus.OK).json({ message: Messages.DOCTOR_PAYOUT_SUCCESS });
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }


  }
