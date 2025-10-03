import express from "express";
const router = express.Router();

import attendanceController from "../controllers/attendance.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, attendanceController.getAllAttendances);
router.get("/:id", authenticateToken, attendanceController.getAttendanceById);
router.post("/", authenticateToken, attendanceController.createAttendance);
router.put("/:id", authenticateToken, attendanceController.updateAttendance);
router.delete("/:id", authenticateToken, attendanceController.deleteAttendance);

export default router;