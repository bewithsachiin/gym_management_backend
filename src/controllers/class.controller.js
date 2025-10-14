import { prisma } from '../config/db.config.js';

// ------------------- GET ALL CLASSES -------------------
export const getClasses = async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        trainer: { select: { name: true } },
        branch: { select: { name: true } }
      },
      orderBy: { date: 'desc' }
    });

    const formatted = classes.map(cls => ({
      id: cls.id,
      class_name: cls.class_name,
      trainer_name: cls.trainer?.name || null,
      branch_name: cls.branch?.name || null,
      date: cls.date.toISOString().split('T')[0],
      time: cls.time.toISOString(),
      schedule_day: cls.schedule_day,
      total_sheets: cls.total_sheets,
      status: cls.status
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

// ------------------- GET CLASS BY ID -------------------
export const getClassById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        trainer: { select: { name: true } },
        branch: { select: { name: true } }
      }
    });

    if (!cls) return res.status(404).json({ success: false, message: "Class not found" });

    const formatted = {
      id: cls.id,
      class_name: cls.class_name,
      trainer_name: cls.trainer?.name || null,
      branch_name: cls.branch?.name || null,
      date: cls.date.toISOString().split('T')[0],
      time: cls.time.toISOString(),
      schedule_day: cls.schedule_day,
      total_sheets: cls.total_sheets,
      status: cls.status
    };

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

// ------------------- CREATE CLASS -------------------
export const createClass = async (req, res, next) => {
  try {
    const {
      class_name,
      trainerId,
      branchId,
      date,
      time,
      schedule_day,
      total_sheets,
      status
    } = req.body;

    if (!class_name || !date || !time || !total_sheets) {
      return res.status(400).json({ success: false, message: "class_name, date, time, total_sheets are required" });
    }

    const cls = await prisma.class.create({
      data: {
        class_name,
        trainer_id: trainerId ? Number(trainerId) : null,
        branch_id: branchId ? Number(branchId) : null,
        date: new Date(date),
        time: new Date(time),
        schedule_day: schedule_day || null,
        total_sheets: Number(total_sheets),
        status: status || 'ACTIVE'
      },
      include: {
        trainer: { select: { name: true } },
        branch: { select: { name: true } }
      }
    });

    const formatted = {
      id: cls.id,
      class_name: cls.class_name,
      trainer_name: cls.trainer?.name || null,
      branch_name: cls.branch?.name || null,
      date: cls.date.toISOString().split('T')[0],
      time: cls.time.toISOString(),
      schedule_day: cls.schedule_day,
      total_sheets: cls.total_sheets,
      status: cls.status
    };

    res.status(201).json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

// ------------------- UPDATE CLASS -------------------
export const updateClass = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const {
      class_name,
      trainerId,
      branchId,
      date,
      time,
      schedule_day,
      total_sheets,
      status
    } = req.body;

    const data = {};
    if (class_name !== undefined) data.class_name = class_name;
    if (trainerId !== undefined) data.trainer_id = Number(trainerId);
    if (branchId !== undefined) data.branch_id = Number(branchId);
    if (date !== undefined) data.date = new Date(date);
    if (time !== undefined) data.time = new Date(time);
    if (schedule_day !== undefined) data.schedule_day = schedule_day;
    if (total_sheets !== undefined) data.total_sheets = Number(total_sheets);
    if (status !== undefined) data.status = status;

    const cls = await prisma.class.update({
      where: { id },
      data,
      include: {
        trainer: { select: { name: true } },
        branch: { select: { name: true } }
      }
    });

    const formatted = {
      id: cls.id,
      class_name: cls.class_name,
      trainer_name: cls.trainer?.name || null,
      branch_name: cls.branch?.name || null,
      date: cls.date.toISOString().split('T')[0],
      time: cls.time.toISOString(),
      schedule_day: cls.schedule_day,
      total_sheets: cls.total_sheets,
      status: cls.status
    };

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

// ------------------- DELETE CLASS -------------------
export const deleteClass = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.class.delete({ where: { id } });
    res.json({ success: true, message: "Class deleted successfully" });
  } catch (err) {
    next(err);
  }
};
