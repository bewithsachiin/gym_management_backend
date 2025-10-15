import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Routes
router.get("/", getAllTasks);       // Get all tasks
router.get("/:id", getTaskById);    // Get task by ID
router.post("/", createTask);       // Create new task
router.put("/:id", updateTask);  
router.patch("/:id", updateTask);     // Update task
router.delete("/:id", deleteTask);  // Delete task

export default router;
