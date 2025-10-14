import express from "express";
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller.js";

import upload from "../middleware/upload.middleware.js"; // multer + Cloudinary

const router = express.Router();

// CRUD routes
router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.post("/", upload.single("profile_photo"), createStaff); // POST with optional image
router.put("/:id", upload.single("profile_photo"), updateStaff); // PUT with optional image
router.delete("/:id", deleteStaff);

export default router;
