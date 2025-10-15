import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  changePassword,
} from "../controllers/memberController.js";

const router = express.Router();

// CRUD routes
router.post("/", validateBody, createMember);
router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

// Change password
router.put("/:id/change-password", changePassword);

export default router;



