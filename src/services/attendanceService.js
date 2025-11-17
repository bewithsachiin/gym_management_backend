const prisma = require('../config/db');

class AttendanceService {
  /**
   * Validate QR Code
   */
  async validateQRCode(qrData) {
    try {
      // Handle both string and object qrData
      const data = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

      // Check if QR code is for gym check-in
      if (data.purpose !== 'gym_checkin') {
        throw new Error('Invalid QR code purpose');
      }

      // Check if QR code has expired
      const expiresAt = new Date(data.expires_at);
      if (new Date() > expiresAt) {
        throw new Error('QR code has expired');
      }

      // Check if member exists
      const member = await prisma.user.findFirst({
        where: {
          id: parseInt(data.member_id),
          role: 'member'
        }
      });

      if (!member) {
        throw new Error('Member not found');
      }

      return {
        valid: true,
        memberId: data.member_id,
        memberName: data.member_name,
        member
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if member is currently checked in
   */
  async isCurrentlyCheckedIn(memberId, branchId) {
    const existing = await prisma.attendance.findFirst({
      where: {
        memberId: parseInt(memberId),
        branchId: branchId ? parseInt(branchId) : undefined,
        checkOutTime: null,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      orderBy: {
        checkInTime: 'desc'
      }
    });

    return existing;
  }

  /**
   * Record Check-In
   */
  async checkIn(memberId, branchId, staffId = null) {
    try {
      // Check if already checked in
      const existing = await this.isCurrentlyCheckedIn(memberId, branchId);

      if (existing) {
        return {
          success: false,
          message: 'Member is already checked in',
          attendance: existing
        };
      }

      // Create new check-in record
      const now = new Date();
      const attendance = await prisma.attendance.create({
        data: {
          memberId: parseInt(memberId),
          staffId: staffId ? parseInt(staffId) : null,
          branchId: branchId ? parseInt(branchId) : 1,
          date: now,
          checkInTime: now,
          status: 'active'
        }
      });

      return {
        success: true,
        message: 'Check-in successful',
        attendance
      };
    } catch (error) {
      console.error('Check-in error:', error);
      throw error;
    }
  }

  /**
   * Record Check-Out
   */
  async checkOut(memberId, branchId, staffId = null) {
    try {
      // Find active check-in
      const existing = await this.isCurrentlyCheckedIn(memberId, branchId);

      if (!existing) {
        return {
          success: false,
          message: 'No active check-in found for this member'
        };
      }

      // Calculate total hours
      const now = new Date();
      const checkInTime = new Date(existing.checkInTime);
      const totalHours = (now - checkInTime) / (1000 * 60 * 60); // Convert to hours

      // Update record with check-out time
      const attendance = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkOutTime: now,
          totalHours,
          status: 'completed'
        }
      });

      return {
        success: true,
        message: 'Check-out successful',
        attendance,
        totalHours: totalHours.toFixed(2)
      };
    } catch (error) {
      console.error('Check-out error:', error);
      throw error;
    }
  }

  /**
   * Scan QR Code and process check-in/out
   */
  async scanQRCode(qrData, branchId, staffId = null) {
    try {
      // Validate QR code
      const validation = await this.validateQRCode(qrData);

      if (!validation.valid) {
        return {
          success: false,
          message: 'Invalid QR code'
        };
      }

      const memberId = validation.memberId;

      // Check current status
      const existing = await this.isCurrentlyCheckedIn(memberId, branchId);

      if (existing) {
        // Already checked in, so check out
        return await this.checkOut(memberId, branchId, staffId);
      } else {
        // Not checked in, so check in
        return await this.checkIn(memberId, branchId, staffId);
      }
    } catch (error) {
      console.error('QR scan error:', error);
      throw error;
    }
  }

  /**
   * Get today's attendance for a branch
   */
  async getTodayAttendance(branchId) {
    try {
      const attendance = await prisma.attendance.findMany({
        where: {
          branchId: branchId ? parseInt(branchId) : undefined,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          branch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          checkInTime: 'desc'
        }
      });

      return attendance;
    } catch (error) {
      console.error('Get today attendance error:', error);
      throw error;
    }
  }

  /**
   * Get member's attendance history
   */
  async getMemberHistory(memberId, limit = 30) {
    try {
      const attendance = await prisma.attendance.findMany({
        where: {
          memberId: parseInt(memberId)
        },
        include: {
          branch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { date: 'desc' },
          { checkInTime: 'desc' }
        ],
        take: limit
      });

      return attendance;
    } catch (error) {
      console.error('Get member history error:', error);
      throw error;
    }
  }

  /**
   * Get member's today attendance
   */
  async getMemberTodayAttendance(memberId) {
    try {
      const attendance = await prisma.attendance.findMany({
        where: {
          memberId: parseInt(memberId),
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        include: {
          branch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          checkInTime: 'desc'
        }
      });

      return attendance;
    } catch (error) {
      console.error('Get member today attendance error:', error);
      throw error;
    }
  }

  /**
   * Get all attendance (with filters)
   */
  async getAttendance(filters = {}) {
    try {
      const where = {};

      if (filters.branchId) {
        where.branchId = parseInt(filters.branchId);
      }

      if (filters.memberId) {
        where.memberId = parseInt(filters.memberId);
      }

      if (filters.date) {
        const date = new Date(filters.date);
        where.date = {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        };
      }

      if (filters.status) {
        where.status = filters.status;
      }

      const attendance = await prisma.attendance.findMany({
        where,
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          branch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { date: 'desc' },
          { checkInTime: 'desc' }
        ],
        take: 100
      });

      return attendance;
    } catch (error) {
      console.error('Get attendance error:', error);
      throw error;
    }
  }

  /**
   * Get attendance statistics
   */
  async getStatistics(branchId, startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const attendance = await prisma.attendance.findMany({
        where: {
          branchId: branchId ? parseInt(branchId) : undefined,
          date: {
            gte: start,
            lte: end
          },
          status: 'completed'
        }
      });

      const totalVisits = attendance.length;
      const uniqueMembers = new Set(attendance.map(a => a.memberId)).size;
      const avgHoursPerVisit = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0) / totalVisits || 0;
      const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

      return {
        totalVisits,
        uniqueMembers,
        avgHoursPerVisit: avgHoursPerVisit.toFixed(2),
        totalHours: totalHours.toFixed(2)
      };
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  }
}

module.exports = new AttendanceService();
