import express from "express";
import { DoctorController,MulterRequest } from "../controllers/doctorController";
import multer from 'multer';
import { upload } from "../../interfaces/middleware/multerConfig";
import { cookieAuth } from "../../interfaces/middleware/cookieAuth";


import { UserRepositoryImpl } from "../../infrastructure/database/repositories/userRepositoryImpl";
import { DoctorRepositoryImpl } from "../../infrastructure/database/repositories/doctorRepositoryImpl";
import { DepartmentRepositoryImpl } from "../../infrastructure/database/repositories/departmentRepositoryImpl";
import { BookingRepositoryImpl } from "../../infrastructure/database/repositories/bookingRepositoryImpl";
import { AdminWalletRepositoryImpl } from "../../infrastructure/database/repositories/adminWalletRepositoryImpl";


const router = express.Router();

const doctorController = new DoctorController({
  userRepository: new UserRepositoryImpl(),
  doctorRepository: new DoctorRepositoryImpl(),
  departmentRepository: new DepartmentRepositoryImpl(),
  bookingRepository: new BookingRepositoryImpl(),
  adminWalletRepository: new AdminWalletRepositoryImpl(),
});

router.post(
  "/send-otp",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "medicalLicense", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  (req, res) => doctorController.sendOtp(req as MulterRequest, res)
);

router.post("/verify-otp", (req, res) => doctorController.verifyOtp(req, res));
router.post("/login", (req, res) => doctorController.login(req, res));
router.get("/departments", (req, res) => doctorController.getAllDepartments(req, res));
router.get("/profile", cookieAuth("doctor"), (req, res) => doctorController.getProfile(req, res));
router.put("/profile", cookieAuth("doctor"), (req, res) => doctorController.updateProfile(req, res));
router.post("/doctors/:doctorId/availability",cookieAuth("doctor"), (req, res) => doctorController.addAvailability(req, res));
router.get("/doctors/:doctorId/availability",cookieAuth("doctor"),(req, res) => doctorController.fetchAvailability(req, res));
router.delete("/doctors/:doctorId/availability",cookieAuth("doctor"),(req, res) => doctorController.removeAvailabilitySlot(req, res));
router.get("/bookings", cookieAuth("doctor"), (req, res) =>doctorController.getBookings(req, res));
router.put("/doctors/:doctorId/availability",cookieAuth("doctor"),(req, res) => doctorController.editAvailability(req, res));
router.get("/wallet-summary", cookieAuth("doctor"), (req, res) =>doctorController.getWalletSummary(req, res));
router.put("/bookings/:bookingId/cancel", cookieAuth("doctor"), (req, res) =>doctorController.cancelBooking(req, res));
router.put("/complete-profile/:doctorId", (req, res) => doctorController.completeProfile(req, res));
router.get("/bookings/:bookingId", cookieAuth("doctor"), (req, res) => doctorController.getBookingDetails(req, res));


export default router;