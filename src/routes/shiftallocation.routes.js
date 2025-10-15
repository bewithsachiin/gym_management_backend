import express from "express";
import {
  createShiftAllocation,
  getAllShiftAllocations,
  getShiftAllocationById,
  updateShiftAllocation,
  deleteShiftAllocation,
} from "../controllers/shiftallocation.controller.js";

const router = express.Router();

// CRUD routes
router.post("/", createShiftAllocation);
router.get("/", getAllShiftAllocations);
router.get("/:id", getShiftAllocationById);
router.put("/:id", updateShiftAllocation);
router.delete("/:id", deleteShiftAllocation);

export default router;
