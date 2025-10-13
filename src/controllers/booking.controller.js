import { prisma } from '../config/db.config.js';

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({ include: { member: true, plan: true } });
    res.json(bookings);
  } catch (err) { next(err); }
};

export const createBooking = async (req, res, next) => {
  try {
    const { memberId, planId, status } = req.body;
    const booking = await prisma.booking.create({
      data: {
        memberId: Number(memberId),
        planId: Number(planId),
        status: status || 'pending',
        requestedAt: new Date(),
      },
    });
    res.json(booking);
  } catch (err) { next(err); }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await prisma.booking.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
export const getBookingById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const booking = await prisma.booking.findUnique({ where: { id: Number(id) }, include: { member: true, plan: true } });
        if(!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    }catch(err){
        next(err);
    }
}