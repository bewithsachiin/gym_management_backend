import express from "express";
import { uploadImage } from "../middleware/upload.middleware.js"; // named import
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller.js";

const router = express.Router();

// CRUD routes
router.get("/", getAllStaff);
router.get("/:id", getStaffById);

// POST with optional profile photo
router.post("/", uploadImage("staff_profiles").single("profile_photo"), createStaff);

// PUT with optional profile photo
router.put("/:id", uploadImage("staff_profiles").single("profile_photo"), updateStaff);

router.delete("/:id", deleteStaff);

export default router;
