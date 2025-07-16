import express from "express";
import { AdminController } from "../controllers/adminController";
import { cookieAuth } from "../middleware/cookieAuth";
import { verifyToken } from "../middleware/authMiddleware";
import {AuthController} from "../controllers/authController"
import { TokenService } from "../../infrastructure/services/TokenService";


import { UserRepositoryImpl } from "../../infrastructure/database/repositories/userRepositoryImpl";
import { DoctorRepositoryImpl } from "../../infrastructure/database/repositories/doctorRepositoryImpl";
import { DepartmentRepositoryImpl } from "../../infrastructure/database/repositories/departmentRepositoryImpl";
import { BookingRepositoryImpl } from "../../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../../infrastructure/database/repositories/adminWalletRepositoryImpl";

const router = express.Router();
const adminController = new AdminController({
  userRepository: new UserRepositoryImpl(),
  doctorRepository: new DoctorRepositoryImpl(),
  departmentRepository: new DepartmentRepositoryImpl(),
  bookingRepository: new BookingRepositoryImpl(),
  adminWalletRepository: new AdminWalletRepositoryImpl(),
});

const authController = new AuthController(new TokenService(), "refreshToken");

router.get("/refresh-token", (req, res) => authController.refreshToken(req, res));

router.post("/login", (req, res) => adminController.adminLogin(req, res));
router.get("/protected", verifyToken("admin"), (req, res) => {
  res.status(200).json({ message: "Admin authenticated" });
});

router.get("/unverified-doctors", cookieAuth("admin"), (req, res) => adminController.getUnverifiedDoctors(req, res));
router.post("/verify-doctor/:id", cookieAuth("admin"), (req, res) => adminController.verifyDoctor(req, res));
router.post("/reject-doctor/:id", cookieAuth("admin"), (req, res) => adminController.rejectDoctor(req, res));
router.get("/doctors", cookieAuth("admin"), (req, res) => adminController.getAllDoctors(req, res));
router.patch("/doctors/:id/:action", cookieAuth("admin"), (req, res) => adminController.toggleDoctorBlockStatus(req, res));
router.get("/users", cookieAuth("admin"), (req, res) => adminController.getAllUsers(req, res));
router.patch("/users/:id/:action", cookieAuth("admin"), (req, res) => adminController.toggleUserBlockStatus(req, res));
router.post("/departments", cookieAuth("admin"), (req, res) => adminController.createDepartment(req, res));
router.get("/departments", cookieAuth("admin"), (req, res) => adminController.getDepartments(req, res));
router.patch("/departments/:id/status", cookieAuth("admin"), (req, res) => adminController.toggleDepartmentStatus(req, res));
router.get("/pending-doctors",cookieAuth("admin"),(req, res) => adminController.getPendingDoctors(req, res));
router.get("/wallet-summary", cookieAuth("admin"), (req, res) =>adminController.getWalletSummary(req, res));
router.post("/pay-doctor/:id", cookieAuth("admin"), (req, res) =>adminController.payoutDoctor(req, res));

export default router;
