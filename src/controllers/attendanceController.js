const attendanceService = require('../services/attendanceService');

class AttendanceController {
  /**
   * Scan QR Code - Main endpoint for check-in/out
   */
  async scanQR(req, res) {
    try {
      const { qrData } = req.body;
      const userId = req.user.id;
      const userBranchId = req.user.branchId;

      if (!qrData) {
        return res.status(400).json({
          success: false,
          message: 'QR code data is required'
        });
      }

      // Look up staff ID from user ID (if staff)
      const prisma = require('../config/db');
      const staff = await prisma.staff.findFirst({
        where: { userId: userId }
      });
      const staffId = staff ? staff.id : null;

      const result = await attendanceService.scanQRCode(
        qrData,
        userBranchId,
        staffId
      );

      return res.json(result);
    } catch (error) {
      console.error('Scan QR error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to process QR code'
      });
    }
  }

  /**
   * Manual Check-In
   */
  async checkIn(req, res) {
    try {
      const { memberId } = req.body;
      const userId = req.user.id;
      const userBranchId = req.user.branchId;

      if (!memberId) {
        return res.status(400).json({
          success: false,
          message: 'Member ID is required'
        });
      }

      // Look up staff ID from user ID (if staff)
      const prisma = require('../config/db');
      const staff = await prisma.staff.findFirst({
        where: { userId: userId }
      });
      const staffId = staff ? staff.id : null;

      const result = await attendanceService.checkIn(
        memberId,
        userBranchId,
        staffId
      );

      return res.json(result);
    } catch (error) {
      console.error('Check-in error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to check in'
      });
    }
  }

  /**
   * Manual Check-Out
   */
  async checkOut(req, res) {
    try {
      const { memberId } = req.body;
      const userId = req.user.id;
      const userBranchId = req.user.branchId;

      if (!memberId) {
        return res.status(400).json({
          success: false,
          message: 'Member ID is required'
        });
      }

      // Look up staff ID from user ID (if staff)
      const prisma = require('../config/db');
      const staff = await prisma.staff.findFirst({
        where: { userId: userId }
      });
      const staffId = staff ? staff.id : null;

      const result = await attendanceService.checkOut(
        memberId,
        userBranchId,
        staffId
      );

      return res.json(result);
    } catch (error) {
      console.error('Check-out error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to check out'
      });
    }
  }

  /**
   * Get Today's Attendance
   */
  async getTodayAttendance(req, res) {
    try {
      const userBranchId = req.user.branchId;
      const userRole = req.user.role;

      // SuperAdmin can see all branches
      let branchId = userBranchId;
      if (userRole === 'superadmin' && req.query.branchId) {
        branchId = parseInt(req.query.branchId);
      }

      const attendance = await attendanceService.getTodayAttendance(branchId);

      return res.json({
        success: true,
        data: attendance
      });
    } catch (error) {
      console.error('Get today attendance error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance'
      });
    }
  }

  /**
   * Get Member's Attendance History
   */
  async getMemberHistory(req, res) {
    try {
      const memberId = req.params.memberId || req.user.id;
      const limit = req.query.limit || 30;

      const attendance = await attendanceService.getMemberHistory(
        memberId,
        limit
      );

      return res.json({
        success: true,
        data: attendance
      });
    } catch (error) {
      console.error('Get member history error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance history'
      });
    }
  }

  /**
   * Get Member's Today Attendance
   */
  async getMemberTodayAttendance(req, res) {
    try {
      const memberId = req.params.memberId || req.user.id;

      const attendance = await attendanceService.getMemberTodayAttendance(memberId);

      return res.json({
        success: true,
        data: attendance
      });
    } catch (error) {
      console.error('Get member today attendance error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get today attendance'
      });
    }
  }

  /**
   * Get All Attendance (with filters)
   */
  async getAttendance(req, res) {
    try {
      const filters = {
        branchId: req.query.branchId,
        memberId: req.query.memberId,
        date: req.query.date,
        status: req.query.status
      };

      // Apply access control
      if (req.user.role !== 'superadmin' && req.user.branchId) {
        filters.branchId = req.user.branchId;
      }

      const attendance = await attendanceService.getAttendance(filters);

      return res.json({
        success: true,
        data: attendance
      });
    } catch (error) {
      console.error('Get attendance error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance'
      });
    }
  }

  /**
   * Get Attendance Statistics
   */
  async getStatistics(req, res) {
    try {
      const branchId = req.query.branchId || req.user.branchId;
      const startDate = req.query.startDate || new Date().toISOString().split('T')[0];
      const endDate = req.query.endDate || new Date().toISOString().split('T')[0];

      const stats = await attendanceService.getStatistics(
        branchId,
        startDate,
        endDate
      );

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get statistics'
      });
    }
  }

  /**
   * Check member's current status
   */
  async getStatus(req, res) {
    try {
      const memberId = req.params.memberId || req.user.id;
      const branchId = req.user.branchId;

      const attendance = await attendanceService.isCurrentlyCheckedIn(
        memberId,
        branchId
      );

      return res.json({
        success: true,
        checkedIn: !!attendance,
        attendance: attendance || null
      });
    } catch (error) {
      console.error('Get status error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get status'
      });
    }
  }
}

module.exports = new AttendanceController();
