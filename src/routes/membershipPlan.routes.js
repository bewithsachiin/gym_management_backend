import express from "express";
const router = express.Router();

import membershipPlanController from "../controllers/membershipPlan.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, membershipPlanController.getAllMembershipPlans);
router.get("/:id", authenticateToken, membershipPlanController.getMembershipPlanById);
router.post("/", authenticateToken, membershipPlanController.createMembershipPlan);
router.put("/:id", authenticateToken, membershipPlanController.updateMembershipPlan);
router.delete("/:id", authenticateToken, membershipPlanController.deleteMembershipPlan);

export default router;
