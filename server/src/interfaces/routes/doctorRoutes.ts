
import express from "express";
import { MulterRequest } from "../controllers/doctorController";
import { verifyToken } from "../middleware/authMiddleware";
import upload from '../middleware/upload';
import { doctorAuthController, doctorController } from "../../di/doctorDI"; 
import { Role } from "../../utils/Constance";
const router = express.Router();

router.post(
  "/send-otp",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "medicalLicense", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  (req, res) => doctorController.sendOtp(req as MulterRequest, res)
);

router.get('/refresh-token', (req, res)=> doctorAuthController.refreshToken(req, res))
router.post("/verify-otp", (req, res) => doctorController.verifyOtp(req, res));
router.post("/login", (req, res) => doctorController.login(req, res));
router.get("/departments", (req, res) => doctorController.getAllDepartments(req, res));
router.get("/profile", verifyToken(Role.DOCTOR), (req, res) => doctorController.getProfile(req, res));
router.put("/profile", verifyToken(Role.DOCTOR), (req, res) => doctorController.updateProfile(req, res));
router.post("/availability-rules", verifyToken(Role.DOCTOR), (req, res) => doctorController.addAvailabilityRule(req, res));
router.get("/availability-rules", verifyToken(Role.DOCTOR), (req, res) => doctorController.fetchAvailabilityRule(req, res));
router.put("/availability-rules/:dayOfWeek",verifyToken(Role.DOCTOR),(req, res) => doctorController.editAvailabilityRule(req, res));

router.delete("/availability-rules/:dayOfWeek", verifyToken(Role.DOCTOR), (req, res) => doctorController.deleteAvailabilityRule(req, res));
router.delete("/availability-exceptions/:exceptionId",verifyToken(Role.DOCTOR),(req, res) => doctorController.deleteAvailabilityException(req, res));

router.get("/bookings", verifyToken(Role.DOCTOR), (req, res) => doctorController.getBookings(req, res));
router.get("/wallet-summary", verifyToken(Role.DOCTOR), (req, res) => doctorController.getWalletSummary(req, res));
router.put("/bookings/:bookingId/cancel", verifyToken(Role.DOCTOR), (req, res) => doctorController.cancelBooking(req, res));
router.put("/complete-profile/:doctorId", (req, res) => doctorController.completeProfile(req, res));
router.get("/bookings/:bookingId", verifyToken(Role.DOCTOR), (req, res) => doctorController.getBookingDetails(req, res));
router.post("/availability-exceptions",verifyToken(Role.DOCTOR),(req, res) => doctorController.addAvailabilityException(req, res));
router.get("/availability-exceptions",verifyToken(Role.DOCTOR),(req, res) => doctorController.fetchAvailabilityExceptions(req, res));

export default router;
