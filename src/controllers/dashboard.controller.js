import { prisma } from '../config/db.config.js';

export const getSuperAdminStats = async (req, res, next) => {
  try {
    const totalMembers = await prisma.member.count();
    const totalStaff = await prisma.staff.count();
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' }
    });
    const activeClasses = await prisma.class.count({ where: { status: 'ACTIVE' } });

    res.json({
      totalMembers,
      totalStaff,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeClasses
    });
  } catch (err) { next(err); }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const branchId = req.staff?.branchId || req.params.branchId;
    const totalMembers = await prisma.member.count({ where: { branchId } });
    const totalStaff = await prisma.staff.count({ where: { branchId } });
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { member: { branchId }, status: 'COMPLETED' }
    });
    const activeClasses = await prisma.class.count({ where: { branchId, status: 'ACTIVE' } });

    res.json({
      totalMembers,
      totalStaff,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeClasses
    });
  } catch (err) { next(err); }
};

export const getManagerStats = async (req, res, next) => {
  try {
    const branchId = req.staff?.branchId;
    const totalMembers = await prisma.member.count({ where: { branchId } });
    const totalStaff = await prisma.staff.count({ where: { branchId } });
    const activeClasses = await prisma.class.count({ where: { branchId, status: 'ACTIVE' } });

    res.json({
      totalMembers,
      totalStaff,
      activeClasses
    });
  } catch (err) { next(err); }
};

export const getTrainerStats = async (req, res, next) => {
  try {
    const trainerId = req.staff?.id;
    const sessions = await prisma.session.count({ where: { trainerId } });
    const upcomingSessions = await prisma.session.count({
      where: { trainerId, date: { gte: new Date() } }
    });

    res.json({
      totalSessions: sessions,
      upcomingSessions
    });
  } catch (err) { next(err); }
};

export const getMemberStats = async (req, res, next) => {
  try {
    const memberId = req.member?.id;
    const bookings = await prisma.booking.count({ where: { memberId } });
    const attendances = await prisma.memberAttendance.count({ where: { memberId } });

    res.json({
      totalBookings: bookings,
      totalAttendances: attendances
    });
  } catch (err) { next(err); }
};

export const getGeneralTrainerStats = async (req, res, next) => {
  try {
    const trainerId = req.staff?.id;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const classesToday = await prisma.class.count({
      where: { trainerId, createdAt: { gte: startOfDay, lt: endOfDay } }
    });

    const membersToTrain = await prisma.booking.count({
      where: { class: { trainerId }, date: { gte: startOfDay, lt: endOfDay } }
    });

    const weeklyClasses = await prisma.class.count({
      where: { trainerId, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    });

    const pendingFeedback = await prisma.feedback.count({
      where: { staffId: trainerId, status: 'NEW' }
    });

    res.json({
      classesToday,
      membersToTrain,
      weeklyClasses,
      pendingFeedback
    });
  } catch (err) { next(err); }
};
