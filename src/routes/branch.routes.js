import express from "express";
const router = express.Router();

import branchController from "../controllers/branch.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, branchController.getAllBranches);
router.get("/:id", authenticateToken, branchController.getBranchById);
router.post("/", authenticateToken, branchController.createBranch);
router.put("/:id", authenticateToken, branchController.updateBranch);
router.delete("/:id", authenticateToken, branchController.deleteBranch);

export default router;
