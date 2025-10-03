import express from "express";
const router = express.Router();

import classController from "../controllers/class.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, classController.getAllClasses);
router.get("/:id", authenticateToken, classController.getClassById);
router.post("/", authenticateToken, classController.createClass);
router.put("/:id", authenticateToken, classController.updateClass);
router.delete("/:id", authenticateToken, classController.deleteClass);

export default router;
