import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./interfaces/routes/userRoutes";
import adminRoutes from "./interfaces/routes/adminRoutes";
import doctorRoutes from "./interfaces/routes/doctorRoutes";  
import webhookRoutes from "./interfaces/routes/stripeWebhook";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();  


app.use("/api/stripe", webhookRoutes); 


app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use(cookieParser());
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/drnow")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error", err));


app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});
