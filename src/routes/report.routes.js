import express from 'express';
import {
  getAttendanceReport,
  getMembershipReport,
  getSalesReport,
  getStaffAttendanceReport
} from '../controllers/report.controller.js';

const router = express.Router();

router.get('/attendance', getAttendanceReport);
router.get('/membership', getMembershipReport);
router.get('/sales', getSalesReport);
router.get('/staff-attendance', getStaffAttendanceReport);

export default router;
