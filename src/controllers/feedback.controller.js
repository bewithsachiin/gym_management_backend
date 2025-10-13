import { prisma } from '../config/db.config.js';

export const getFeedbacks = async (req, res, next) => {
  try {
    const { type, date, subject } = req.query;
    const where = {};
    if (type) where.type = type;
    if (date) where.createdAt = { gte: new Date(date + 'T00:00:00'), lt: new Date(date + 'T23:59:59') };
    if (subject) where.subject = { contains: subject, mode: 'insensitive' };
    const feedbacks = await prisma.feedback.findMany({
      where,
      include: { member: true, staff: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(feedbacks);
  } catch (err) { next(err); }
};

export const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: Number(req.params.id) },
      include: { member: true, staff: true }
    });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (err) { next(err); }
};

export const createFeedback = async (req, res, next) => {
  try {
    const { memberId, staffId, type, subject, message } = req.body;
    const feedback = await prisma.feedback.create({
      data: {
        memberId: Number(memberId),
        staffId: staffId ? Number(staffId) : null,
        type,
        subject,
        message,
        status: 'NEW'
      },
      include: { member: true, staff: true }
    });
    res.json(feedback);
  } catch (err) { next(err); }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, subject, message, status } = req.body;
    const updated = await prisma.feedback.update({
      where: { id: Number(id) },
      data: {
        type,
        subject,
        message,
        status
      },
      include: { member: true, staff: true }
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    await prisma.feedback.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
