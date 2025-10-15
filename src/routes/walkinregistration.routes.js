import express from "express";
import {
  createWalkinRegistration,
  getAllWalkinRegistrations,
  getWalkinRegistrationById,
  updateWalkinRegistration,
  deleteWalkinRegistration,
} from "../controllers/walkinregistration.controller.js";

const router = express.Router();

// CRUD routes
router.post("/", createWalkinRegistration);
router.get("/", getAllWalkinRegistrations);
router.get("/:id", getWalkinRegistrationById);
router.put("/:id", updateWalkinRegistration);
router.delete("/:id", deleteWalkinRegistration);

export default router;
