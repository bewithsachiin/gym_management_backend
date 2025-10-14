// routes/branch.routes.js
import express from "express";
import upload from "../middleware/upload.middleware.js"; // multer + Cloudinary middleware
import {
  createBranch,
  updateBranch,
  getAllBranches,
  getBranchById,
  deleteBranch
} from "../controllers/branch.controller.js";

const router = express.Router();

// Create branch with optional image upload
router.post("/", upload.single("branch_image"), createBranch);

// Get all branches
router.get("/", getAllBranches);

// Get branch by ID
router.get("/:id", getBranchById);

// Update branch (optional image upload)
router.put("/:id", upload.single("branch_image"), updateBranch);

// Delete branch
router.delete("/:id", deleteBranch);

export default router;