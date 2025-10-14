import express from "express";
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getBookingById,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Routes
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
