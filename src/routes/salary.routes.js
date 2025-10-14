import express from "express";
import {
  getAllSalaryRecords,
  getSalaryRecordById,
  createSalaryRecord,
  updateSalaryRecord,
  deleteSalaryRecord,
} from "../controllers/salary.controller.js";

const router = express.Router();

// CRUD routes
router.get("/", getAllSalaryRecords);          // Get all salary records
router.get("/:id", getSalaryRecordById);      // Get single record
router.post("/", createSalaryRecord);         // Create new record
router.put("/:id", updateSalaryRecord);       // Update record
router.delete("/:id", deleteSalaryRecord);    // Delete record

export default router;
