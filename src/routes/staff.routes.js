import express from "express";
const router = express.Router();

import staffController from "../controllers/staff.controller.js";
// import { authenticateToken } from "../middleware/auth.js";

router.get("/", staffController.getAllStaff);
router.get("/:id", staffController.getStaffById);
router.post("/", staffController.createStaff);
router.put("/:id", staffController.updateStaff);
router.delete("/:id", staffController.deleteStaff);

export default router;

// authenticateToken,
