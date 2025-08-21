 

import express from "express";
import { cookieAuth } from "../middleware/cookieAuth";
import { verifyToken } from "../middleware/authMiddleware";

import { adminController, authController } from "../../di/adminDI"; 

const router = express.Router();

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

router.get("/pending-doctors", cookieAuth("admin"), (req, res) => adminController.getPendingDoctors(req, res));
router.get("/wallet-summary", cookieAuth("admin"), (req, res) => adminController.getWalletSummary(req, res));
router.post("/pay-doctor/:id", cookieAuth("admin"), (req, res) => adminController.payoutDoctor(req, res));

export default router;
