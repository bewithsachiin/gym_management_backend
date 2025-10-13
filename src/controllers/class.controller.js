import { prisma } from '../config/db.config.js';

export const getClasses = async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        trainer: {
          select: { name: true }
        }
      }
    });
    // Map to frontend format
    const formattedClasses = classes.map(cls => ({
      id: cls.id,
      class_name: cls.name,
      trainer_name: cls.trainer.name,
      date: cls.date.toISOString().split('T')[0],
      time: cls.time,
      schedule_day: cls.scheduleDay,
      total_sheets: cls.totalSheets,
      status: cls.status
    }));
    res.json(formattedClasses);
  } catch (err) { next(err); }
};

export const createClass = async (req, res, next) => {
  try {
    const { class_name, trainerId, date, time, schedule_day, total_sheets, status } = req.body;
    const cls = await prisma.class.create({
      data: {
        name: class_name,
        trainerId: Number(trainerId),
        date: new Date(date),
        time,
        scheduleDay: schedule_day,
        totalSheets: Number(total_sheets),
        status: status || 'Active'
      },
      include: {
        trainer: {
          select: { name: true }
        }
      }
    });
    const formatted = {
      id: cls.id,
      class_name: cls.name,
      trainer_name: cls.trainer.name,
      date: cls.date.toISOString().split('T')[0],
      time: cls.time,
      schedule_day: cls.scheduleDay,
      total_sheets: cls.totalSheets,
      status: cls.status
    };
    res.json(formatted);
  } catch (err) { next(err); }
};

export const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { class_name, trainerId, date, time, schedule_day, total_sheets, status } = req.body;
    const cls = await prisma.class.update({
      where: { id: Number(id) },
      data: {
        name: class_name,
        trainerId: Number(trainerId),
        date: new Date(date),
        time,
        scheduleDay: schedule_day,
        totalSheets: Number(total_sheets),
        status
      },
      include: {
        trainer: {
          select: { name: true }
        }
      }
    });
    const formatted = {
      id: cls.id,
      class_name: cls.name,
      trainer_name: cls.trainer.name,
      date: cls.date.toISOString().split('T')[0],
      time: cls.time,
      schedule_day: cls.scheduleDay,
      total_sheets: cls.totalSheets,
      status: cls.status
    };
    res.json(formatted);
  } catch (err) { next(err); }
};

export const deleteClass = async (req, res, next) => {
  try {
    await prisma.class.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
};
