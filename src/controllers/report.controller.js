import { prisma } from "../config/db.config.js";

export const getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate, branchId } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    if (branchId) {
      where.member = { branchId: Number(branchId) };
    }

    const attendances = await prisma.memberAttendance.findMany({
      where,
      include: { member: true },
      orderBy: { date: "desc" },
    });

    res.json(attendances);
  } catch (err) {
    next(err);
  }
};

export const getMembershipReport = async (req, res, next) => {
  try {
    const memberships = await prisma.membership.findMany({
      include: { member: true, plan: true },
      orderBy: { startDate: "desc" },
    });

    res.json(memberships);
  } catch (err) {
    next(err);
  }
};

export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { status: "COMPLETED" };
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: { member: true, invoice: true },
      orderBy: { createdAt: "desc" },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({ payments, totalRevenue });
  } catch (err) {
    next(err);
  }
};

export const getStaffAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate, branchId } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.date = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    if (branchId) {
      where.staff = { branchId: Number(branchId) };
    }

    const attendances = await prisma.staffAttendance.findMany({
      where,
      include: { staff: true },
      orderBy: { date: "desc" },
    });

    res.json(attendances);
  } catch (err) {
    next(err);
  }
};
