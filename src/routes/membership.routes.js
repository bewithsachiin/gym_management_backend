import express from "express";
const router = express.Router();

import membershipController from "../controllers/membership.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, membershipController.getAllMemberships);
router.get("/:id", authenticateToken, membershipController.getMembershipById);
router.post("/", authenticateToken, membershipController.createMembership);
router.put("/:id", authenticateToken, membershipController.updateMembership);
router.delete("/:id", authenticateToken, membershipController.deleteMembership);

export default router;
