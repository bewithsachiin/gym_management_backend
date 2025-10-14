import { prisma } from "../config/db.config.js";

// ✅ Get all bookings
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { member: true, plan: true },
      orderBy: { created_at: "desc" },
    });

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// ✅ Get booking by ID
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: { member: true, plan: true },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// ✅ Create a new booking
export const createBooking = async (req, res, next) => {
  try {
    const { memberId, planId, status } = req.body;

    if (!memberId || !planId) {
      return res.status(400).json({
        success: false,
        message: "memberId and planId are required",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        member_id: Number(memberId),
        plan_id: Number(planId),
        status: (status || "PENDING").toUpperCase(),
      },
      include: { member: true, plan: true },
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Update booking status only
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: status.toUpperCase() },
      include: { member: true, plan: true },
    });

    res.json({
      success: true,
      message: "Booking status updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Full update (e.g. update plan, member, or status)
export const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { memberId, planId, status } = req.body;

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        ...(memberId && { member_id: Number(memberId) }),
        ...(planId && { plan_id: Number(planId) }),
        ...(status && { status: status.toUpperCase() }),
      },
      include: { member: true, plan: true },
    });

    res.json({
      success: true,
      message: "Booking updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Delete booking
export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { id: Number(id) } });

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
