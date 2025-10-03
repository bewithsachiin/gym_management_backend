import express from "express";
const router = express.Router();

import roleController from "../controllers/role.controller.js";
// import { authenticateToken } from "../middleware/auth.js";

router.get("/",  roleController.getAllRoles);
router.get("/:id", roleController.getRoleById);
router.post("/", roleController.createRole);
router.put("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

export default router;
