 

import express from "express";
import { verifyToken } from "../middleware/authMiddleware";

import { createAdminController,  createAuthController } from "../../di/adminDI"; 

const router = express.Router();
const adminController = createAdminController()
const authController = createAuthController()

router.get("/refresh-token", (req, res) => authController.refreshToken(req, res));

router.post("/login", (req, res) => adminController.adminLogin(req, res));


router.get("/unverified-doctors", verifyToken("admin"), (req, res) => adminController.getUnverifiedDoctors(req, res));
router.post("/verify-doctor/:id", verifyToken("admin"), (req, res) => adminController.verifyDoctor(req, res));
router.post("/reject-doctor/:id", verifyToken("admin"), (req, res) => adminController.rejectDoctor(req, res));
router.get("/doctors", verifyToken("admin"), (req, res) => adminController.getAllDoctors(req, res));
router.patch("/doctors/:id/:action", verifyToken("admin"), (req, res) => adminController.toggleDoctorBlockStatus(req, res));

router.get("/users", verifyToken("admin"), (req, res) => adminController.getAllUsers(req, res));
router.patch("/users/:id/:action", verifyToken("admin"), (req, res) => adminController.toggleUserBlockStatus(req, res));

router.post("/departments", verifyToken("admin"), (req, res) => adminController.createDepartment(req, res));
router.get("/departments", verifyToken("admin"), (req, res) => adminController.getDepartments(req, res));
router.patch("/departments/:id/status", verifyToken("admin"), (req, res) => adminController.toggleDepartmentStatus(req, res));

router.get("/pending-doctors", verifyToken("admin"), (req, res) => adminController.getPendingDoctors(req, res));
router.get("/wallet-summary", verifyToken("admin"), (req, res) => adminController.getWalletSummary(req, res));
router.post("/pay-doctor/:id", verifyToken("admin"), (req, res) => adminController.payoutDoctor(req, res));
router.get("/doctors/:id", verifyToken("admin"), (req, res) => adminController.getDoctorById(req, res));

export default router;
