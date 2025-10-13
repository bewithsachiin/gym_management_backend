import express from 'express';
import {
  getMemberAttendance, recordMemberCheckin, recordMemberCheckout,
  getStaffAttendance, recordStaffCheckin, recordStaffCheckout, getMemberAttendanceById, getStaffAttendanceById,
  generateQR, checkinWithQR
} from '../controllers/attendance.controller.js';

const router = express.Router();

// Member Attendance
router.get('/member', getMemberAttendance);
router.post('/member/checkin', recordMemberCheckin);
router.put('/member/:id/checkout', recordMemberCheckout);

// Staff Attendance
router.get('/staff', getStaffAttendance);
router.post('/staff/checkin', recordStaffCheckin);
router.put('/staff/:id/checkout', recordStaffCheckout);

// Get attendance by ID
router.get('/member/:id', getMemberAttendanceById);
router.get('/staff/:id', getStaffAttendanceById);

// QR Check-in
router.post('/generate-qr', generateQR);
router.post('/checkin-qr', checkinWithQR);

export default router;
