import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

router.get("/refresh-token", (req, res) => authController.refreshToken(req, res));

export default router;
