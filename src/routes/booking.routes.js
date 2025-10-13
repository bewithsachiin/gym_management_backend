import express from 'express';
import {
  getBookings, createBooking, updateBookingStatus, deleteBooking, getBookingById
} from '../controllers/booking.controller.js';

const router = express.Router();
router.get('/', getBookings);
router.post('/', createBooking);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);
router.get('/:id', getBookingById);

export default router;
