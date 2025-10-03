import express from "express";
const router = express.Router();

import permissionController from "../controllers/permission.controller.js";
import { authenticateToken } from "../middleware/auth.js";

router.get("/", authenticateToken, permissionController.getAllPermissions);
router.get("/:id", authenticateToken, permissionController.getPermissionById);
router.post("/", authenticateToken, permissionController.createPermission);
router.put("/:id", authenticateToken, permissionController.updatePermission);
router.delete("/:id", authenticateToken, permissionController.deletePermission);

export default router;
