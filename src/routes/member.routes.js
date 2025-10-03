import express from "express";
const router = express.Router();

import memberController from "../controllers/member.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, memberController.getAllMembers);
router.get("/:id", authenticateToken, memberController.getMemberById);
router.post("/", authenticateToken, memberController.createMember);
router.put("/:id", authenticateToken, memberController.updateMember);
router.delete("/:id", authenticateToken, memberController.deleteMember);

export default router;
