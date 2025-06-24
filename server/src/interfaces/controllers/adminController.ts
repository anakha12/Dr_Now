  import { Request, Response } from "express";
  import { LoginAdmin } from "../../application/use_cases/admin/loginAdmin";
  import { UserRepositoryImpl } from "../../infrastructure/database/repositories/userRepositoryImpl";
  import { GetUnverifiedDoctors } from "../../application/use_cases/admin/getUnverifiedDoctors";
  import { DoctorRepositoryImpl } from "../../infrastructure/database/repositories/doctorRepositoryImpl";
  import { VerifyDoctor } from "../../application/use_cases/admin/verifyDoctor";
  import { RejectDoctor } from "../../application/use_cases/admin/rejectDoctor";
  import { GetAllDoctors } from "../../application/use_cases/admin/getAllDoctors";
  import { ToggleBlockDoctor } from "../../application/use_cases/admin/toggleBlockDoctor";
  import { GetAllUsersUseCase } from "../../application/use_cases/admin/getAllUsers";
  import { ToggleUserBlockStatusUseCase } from "../../application/use_cases/admin/toggleUserBlockStatus";
  import { DepartmentRepositoryImpl } from "../../infrastructure/database/repositories/departmentRepositoryImpl";
  import { CreateDepartmentUseCase } from "../../application/use_cases/admin/createDepartment";
  import { GetDepartmentsUseCase } from "../../application/use_cases/admin/getDepartments";
  import { ToggleDepartmentStatusUseCase } from "../../application/use_cases/admin/toggleDepartmentStatus";


  export class AdminController {
    private loginAdmin: LoginAdmin;
    private getUnverifiedDoctorsUseCase: GetUnverifiedDoctors; 
    private verifyDoctorUseCase: VerifyDoctor;
    private rejectDoctorUseCase: RejectDoctor;
    private getAllDoctorsUseCase: GetAllDoctors;
    private toggleBlockDoctorUseCase: ToggleBlockDoctor;
    private getAllUsersUseCase:GetAllUsersUseCase;
    private toggleUserBlockStatusUseCase:ToggleUserBlockStatusUseCase;
    private createDepartmentUseCase: CreateDepartmentUseCase;
    private getDepartmentsUseCase: GetDepartmentsUseCase;
    private toggleDepartmentStatusUseCase: ToggleDepartmentStatusUseCase;

    constructor(userRepository?: UserRepositoryImpl) {
      this.loginAdmin = new LoginAdmin(userRepository || new UserRepositoryImpl());
      this.getUnverifiedDoctorsUseCase = new GetUnverifiedDoctors(new DoctorRepositoryImpl());
      this.verifyDoctorUseCase = new VerifyDoctor(new DoctorRepositoryImpl())
      this.rejectDoctorUseCase = new RejectDoctor(new DoctorRepositoryImpl());
      this.getAllDoctorsUseCase = new GetAllDoctors(new DoctorRepositoryImpl());
      this.toggleBlockDoctorUseCase = new ToggleBlockDoctor(new DoctorRepositoryImpl());
      this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository || new UserRepositoryImpl());
      this.toggleUserBlockStatusUseCase = new ToggleUserBlockStatusUseCase(userRepository || new UserRepositoryImpl());
      const deptRepo = new DepartmentRepositoryImpl();
      this.createDepartmentUseCase = new CreateDepartmentUseCase(deptRepo);
      this.getDepartmentsUseCase = new GetDepartmentsUseCase(deptRepo);
      this.toggleDepartmentStatusUseCase = new ToggleDepartmentStatusUseCase(deptRepo);
    }

    async adminLogin(req: Request, res: Response): Promise<void> {
      try {
        const { email, password } = req.body;
        
        const { token, user } = await this.loginAdmin.execute(email, password);
        if (user.role !== "admin") {
          res.status(403).json({ message: "Not an admin" });
          return;
        }
        res.cookie("userAccessToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", 
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Login successful", user });
      } catch (err: any) {
        res.status(401).json({ message: err.message });
      }
    }

    async getUnverifiedDoctors(req: Request, res: Response): Promise<void> {
      try {
        const doctors = await this.getUnverifiedDoctorsUseCase.execute(); 
        res.status(200).json(doctors);
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }

    async verifyDoctor(req: Request, res: Response): Promise<void> {
      try {
        const doctorId = req.params.id;
        await this.verifyDoctorUseCase.execute(doctorId);
        res.status(200).json({ message: "Doctor verified successfully" });
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }

    async rejectDoctor(req: Request, res: Response): Promise<void> {
      try {
        const doctorId = req.params.id;
        
        await this.rejectDoctorUseCase.execute(doctorId);
        res.status(200).json({ message: "Doctor rejected successfully" });
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }

    async getAllDoctors(req: Request, res: Response): Promise<void> {
      try {
        const doctors = await this.getAllDoctorsUseCase.execute();
        res.status(200).json(doctors);
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }

    async toggleDoctorBlockStatus(req: Request, res: Response): Promise<void> {
      try {
        const { id, action } = req.params;

        if (!["block", "unblock"].includes(action)) {
          res.status(400).json({ message: "Invalid action" });
          return;
        }

        await this.toggleBlockDoctorUseCase.execute(id, action as "block" | "unblock");
        res.status(200).json({ message: `Doctor ${action}ed successfully` });
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
      try {
        const users = await this.getAllUsersUseCase.execute();
        res.status(200).json(users);
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }

    async toggleUserBlockStatus(req: Request, res: Response): Promise<void> {
      try {
        const { id, action } = req.params;

        if (!["block", "unblock"].includes(action)) {
          res.status(400).json({ message: "Invalid action" });
          return;
        }

        const shouldBlock = action === "block";
        await this.toggleUserBlockStatusUseCase.execute(id, shouldBlock);

        res.status(200).json({ message: `User ${action}ed successfully` });
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }


    async createDepartment(req: Request, res: Response) {
    try {
      const dept = await this.createDepartmentUseCase.execute(req.body);
      res.status(201).json(dept);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getDepartments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const depts = await this.getDepartmentsUseCase.execute(page, limit);
      res.status(200).json({ departments: depts });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async toggleDepartmentStatus(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      await this.toggleDepartmentStatusUseCase.execute(id, status);
      res.status(200).json({ message: `Status updated to ${status}` });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  }
