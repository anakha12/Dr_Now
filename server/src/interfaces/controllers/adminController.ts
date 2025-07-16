  import { Request, Response } from "express";
  import { Messages } from "../../utils/Messages";
  import { HttpStatus } from "../../utils/HttpStatus";

  import { LoginAdmin } from "../../application/use_cases/admin/loginAdmin";
  import { GetUnverifiedDoctors } from "../../application/use_cases/admin/getUnverifiedDoctors";
  import { VerifyDoctor } from "../../application/use_cases/admin/verifyDoctor";
  import { RejectDoctor } from "../../application/use_cases/admin/rejectDoctor";
  import { GetAllDoctors } from "../../application/use_cases/admin/getAllDoctors";
  import { ToggleBlockDoctor } from "../../application/use_cases/admin/toggleBlockDoctor";
  import { GetAllUsersUseCase } from "../../application/use_cases/admin/getAllUsers";
  import { ToggleUserBlockStatusUseCase } from "../../application/use_cases/admin/toggleUserBlockStatus";
  import { CreateDepartmentUseCase } from "../../application/use_cases/admin/createDepartment";
  import { GetDepartmentsUseCase } from "../../application/use_cases/admin/getDepartments";
  import { ToggleDepartmentStatusUseCase } from "../../application/use_cases/admin/toggleDepartmentStatus";
  import { GetPendingDoctorPayouts } from "../../application/use_cases/admin/getPendingDoctorPayouts";
  import { GetWalletSummary } from "../../application/use_cases/admin/getWalletSummary";
  import { PayoutDoctorUseCase } from "../../application/use_cases/admin/payoutDoctor";

  import { IUserRepository } from "../../domain/repositories/userRepository";
  import { IDoctorRepository } from "../../domain/repositories/doctorRepository";
  import { IDepartmentRepository } from "../../domain/repositories/departmentRepository";
  import { IBookingRepository } from "../../domain/repositories/bookingRepository";
  import { IAdminWalletRepository } from "../../domain/repositories/adminWalletRepository";

  interface AdminControllerDependencies {
    userRepository: IUserRepository;
    doctorRepository: IDoctorRepository;
    departmentRepository: IDepartmentRepository;
    bookingRepository: IBookingRepository;
    adminWalletRepository: IAdminWalletRepository;
  }

  export class AdminController {
    private _loginAdmin: LoginAdmin;
    private _getUnverifiedDoctorsUseCase: GetUnverifiedDoctors; 
    private _verifyDoctorUseCase: VerifyDoctor;
    private _rejectDoctorUseCase: RejectDoctor;
    private _getAllDoctorsUseCase: GetAllDoctors;
    private _toggleBlockDoctorUseCase: ToggleBlockDoctor;
    private _getAllUsersUseCase:GetAllUsersUseCase;
    private _toggleUserBlockStatusUseCase:ToggleUserBlockStatusUseCase;
    private _createDepartmentUseCase: CreateDepartmentUseCase;
    private _getDepartmentsUseCase: GetDepartmentsUseCase;
    private _toggleDepartmentStatusUseCase: ToggleDepartmentStatusUseCase;
    private _getPendingDoctorPayoutsUseCase: GetPendingDoctorPayouts;
    private _getWalletSummaryUseCase: GetWalletSummary;
    private _payoutDoctorUseCase: PayoutDoctorUseCase;

    constructor(deps:AdminControllerDependencies) {
      this._loginAdmin = new LoginAdmin(deps.userRepository);
      this._getUnverifiedDoctorsUseCase = new GetUnverifiedDoctors(deps.doctorRepository);
      this._verifyDoctorUseCase = new VerifyDoctor(deps.doctorRepository)
      this._rejectDoctorUseCase = new RejectDoctor(deps.doctorRepository);
      this._getAllDoctorsUseCase = new GetAllDoctors(deps.doctorRepository);
      this._toggleBlockDoctorUseCase = new ToggleBlockDoctor(deps.doctorRepository);
      this._getAllUsersUseCase = new GetAllUsersUseCase(deps.userRepository);
      this._toggleUserBlockStatusUseCase = new ToggleUserBlockStatusUseCase(deps.userRepository);
      this._createDepartmentUseCase = new CreateDepartmentUseCase(deps.departmentRepository);
      this._getDepartmentsUseCase = new GetDepartmentsUseCase(deps.departmentRepository);
      this._toggleDepartmentStatusUseCase = new ToggleDepartmentStatusUseCase(deps.departmentRepository);
      this._getPendingDoctorPayoutsUseCase = new GetPendingDoctorPayouts(
        deps.bookingRepository,
        deps.doctorRepository
      );
      this._getWalletSummaryUseCase = new GetWalletSummary(
        deps.adminWalletRepository,
        deps.bookingRepository
      );
      this._payoutDoctorUseCase = new PayoutDoctorUseCase(
        deps.bookingRepository,
        deps.doctorRepository,
        deps.adminWalletRepository
      );

    }

    async adminLogin(req: Request, res: Response): Promise<void> {
      try {
        const { email, password } = req.body;
        
        const { accessToken,refreshToken, user } = await this._loginAdmin.execute(email, password);
        if (user.role !== "admin") {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
          return;
        }
        res.cookie("userAccessToken", accessToken, {
          httpOnly: true,
          secure: false, 
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, 
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
        
        await this._rejectDoctorUseCase.execute(doctorId);
        res.status(HttpStatus.OK).json({ message: Messages.DOCTOR_REJECTED });
      } catch (err: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
      }
    }

    async getAllDoctors(req: Request, res: Response): Promise<void> {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const { doctors, totalDoctors } = await this._getAllDoctorsUseCase.execute(page, limit);

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

        const users = await this._getAllUsersUseCase.execute(page, limit);
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
      const dept = await this._createDepartmentUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json(dept);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getDepartments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
       const { departments, totalPages } = await this._getDepartmentsUseCase.execute(page, limit);
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
      const list = await this._getPendingDoctorPayoutsUseCase.execute();
      res.status(HttpStatus.OK).json(list);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
