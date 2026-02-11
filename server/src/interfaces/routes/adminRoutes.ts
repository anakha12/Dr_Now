 

import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { Role } from "../../utils/Constance";
import { createAdminController,  createAuthController } from "../../di/adminDI"; 

const router = express.Router();
const adminController = createAdminController()
const authController = createAuthController()

router.get("/refresh-token", (req, res) => authController.refreshToken(req, res));

router.post("/login", (req, res) => adminController.adminLogin(req, res));


router.get("/unverified-doctors", verifyToken(Role.ADMIN), (req, res) => adminController.getUnverifiedDoctors(req, res));
router.post("/verify-doctor/:id", verifyToken(Role.ADMIN), (req, res) => adminController.verifyDoctor(req, res));
router.post("/reject-doctor/:id", verifyToken(Role.ADMIN), (req, res) => adminController.rejectDoctor(req, res));
router.get("/doctors", verifyToken(Role.ADMIN), (req, res) => adminController.getAllDoctors(req, res));
router.patch("/doctors/:id/:action", verifyToken(Role.ADMIN), (req, res) => adminController.toggleDoctorBlockStatus(req, res));

router.get("/users", verifyToken(Role.ADMIN), (req, res) => adminController.getAllUsers(req, res));
router.patch("/users/:id/:action", verifyToken(Role.ADMIN), (req, res) => adminController.toggleUserBlockStatus(req, res));

router.post("/departments", verifyToken(Role.ADMIN), (req, res) => adminController.createDepartment(req, res));
router.get("/departments", verifyToken(Role.ADMIN), (req, res) => adminController.getDepartments(req, res));
router.patch("/departments/:id/status", verifyToken(Role.ADMIN), (req, res) => adminController.toggleDepartmentStatus(req, res));

router.get("/pending-doctors", verifyToken(Role.ADMIN), (req, res) => adminController.getPendingDoctors(req, res));
router.get("/wallet-summary", verifyToken(Role.ADMIN), (req, res) => adminController.getWalletSummary(req, res));
router.post("/pay-doctor/:id", verifyToken(Role.ADMIN), (req, res) => adminController.payoutDoctor(req, res));
router.get("/doctors/:id", verifyToken(Role.ADMIN), (req, res) => adminController.getDoctorById(req, res));

export default router;
