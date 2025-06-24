import { Request, Response, NextFunction} from "express";
import express from "express";
import { UserController } from "../controllers/userController";
import { cookieAuth  } from "../middleware/cookieAuth";
import { AuthRequest } from "../middleware/cookieAuth"; 
import { verifyToken } from "../middleware/authMiddleware";


const router = express.Router();        
const userController = new UserController();
router.get("/protected", verifyToken("user"), (req, res) => {
  res.status(200).json({ message: "User authenticated" });
});

router.post("/register", (req: Request, res: Response) => userController.register(req, res));
router.post("/send-otp", (req: Request, res: Response) => userController.sendOtp(req, res));
router.post("/login", (req: Request, res: Response) => userController.login(req, res));
router.post("/google-login", (req: Request, res: Response) => userController.googleLogin(req, res));
router.post("/send-reset-otp", (req: Request, res: Response) => userController.sendResetOtpHandler(req, res));
router.post("/reset-password", (req: Request, res: Response) => userController.resetPasswordHandler(req, res));
router.get("/get-all-doctors",(req: Request, res: Response) => userController.getAllDoctors(req, res));
router.get("/doctor/:id", (req: Request, res: Response) => userController.getDoctorById(req, res));
router.post("/create-checkout-session", (req: Request, res: Response) =>userController.createCheckoutSession(req, res));
router.get("/booked-slots/:doctorId", (req: Request, res: Response) =>userController.getBookedSlots(req, res));
router.get("/user/profile", verifyToken("user"), (req, res) => userController.getUserProfile(req, res));
router.get("/user/bookings", verifyToken("user"), (req: Request, res: Response) => userController.getUserBookings(req, res));
router.post("/user/bookings/:id/cancel", verifyToken("user"), (req: Request, res: Response) =>userController.cancelBooking(req, res));
router.get("/departments", verifyToken("user"),(req: Request, res: Response) => userController.getDepartments(req, res));
export default router;
