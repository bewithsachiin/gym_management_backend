const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

// Scan QR Code (for reception/admin/staff)
router.post(
  '/scan-qr',
  authenticateToken,
  accessControl(),
  checkPermission(['superadmin', 'admin', 'receptionist', 'generaltrainer', 'personaltrainer']),
  attendanceController.scanQR
);

// Manual check-in (for reception/admin)
router.post(
  '/checkin',
  authenticateToken,
  accessControl(),
  checkPermission(['superadmin', 'admin', 'receptionist']),
  attendanceController.checkIn
);

// Manual check-out (for reception/admin)
router.post(
  '/checkout',
  authenticateToken,
  accessControl(),
  checkPermission(['superadmin', 'admin', 'receptionist']),
  attendanceController.checkOut
);

// Get today's attendance
router.get(
  '/today',
  authenticateToken,
  accessControl(),
  attendanceController.getTodayAttendance
);

// Get all attendance (with filters)
router.get(
  '/',
  authenticateToken,
  accessControl(),
  attendanceController.getAttendance
);

// Get member's attendance history
router.get(
  '/member/:memberId/history',
  authenticateToken,
  accessControl({ includeUserFilter: true }),
  attendanceController.getMemberHistory
);

// Get member's today attendance
router.get(
  '/member/:memberId/today',
  authenticateToken,
  accessControl({ includeUserFilter: true }),
  attendanceController.getMemberTodayAttendance
);

// Get my attendance (for logged-in member)
router.get(
  '/my-history',
  authenticateToken,
  attendanceController.getMemberHistory
);

// Get my today attendance
router.get(
  '/my-today',
  authenticateToken,
  attendanceController.getMemberTodayAttendance
);

// Get member's current status
router.get(
  '/status/:memberId',
  authenticateToken,
  accessControl({ includeUserFilter: true }),
  attendanceController.getStatus
);

// Get my status
router.get(
  '/my-status',
  authenticateToken,
  attendanceController.getStatus
);

// Get statistics
router.get(
  '/statistics',
  authenticateToken,
  accessControl(),
  checkPermission(['superadmin', 'admin', 'receptionist']),
  attendanceController.getStatistics
);

module.exports = router;
