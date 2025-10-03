import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import userRoutes from "./src/routes/user.routes.js";
// import authRoutes from "./src/routes/auth.routes.js";
import branchRoutes from "./src/routes/branch.routes.js";
import memberRoutes from "./src/routes/member.routes.js";
import membershipPlanRoutes from "./src/routes/membershipPlan.routes.js";
import membershipRoutes from "./src/routes/membership.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import invoiceRoutes from "./src/routes/invoice.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import classRoutes from "./src/routes/class.routes.js";
import roleRoutes from "./src/routes/role.routes.js";
import permissionRoutes from "./src/routes/permission.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(morgan("combined"));
app.use(limiter);
app.use(express.json());

// app.use("/auth", authRoutes);
app.use("api/users", userRoutes);
app.use("/branches", branchRoutes);
app.use("/members", memberRoutes);
app.use("/membership-plans", membershipPlanRoutes);
app.use("/memberships", membershipRoutes);
app.use("/staff", staffRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/payments", paymentRoutes);
app.use("/classes", classRoutes);
app.use("/roles", roleRoutes);
app.use("/permissions", permissionRoutes);
app.use("/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
