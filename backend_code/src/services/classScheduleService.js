const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

const getAllClasses = async (filters = {}) => {
  const { branchId, trainer_id, status } = filters;

  const where = {};
  if (branchId) where.branchId = parseInt(branchId);
  if (trainer_id) where.trainer_id = parseInt(trainer_id);
  if (status) where.status = status;

  return await prisma.classSchedule.findMany({
    where,
    include: {
      trainer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      admin: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getClassById = async (id, branchId = null) => {
  const where = { id: parseInt(id) };
  if (branchId) where.branchId = parseInt(branchId);

  return await prisma.classSchedule.findFirst({
    where,
    include: {
      trainer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      admin: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

const createClass = async (classData, userId) => {
  const { class_name, trainer_id, date, time, schedule_day, total_sheets, status, branchId, adminId } = classData;

  // Validate schedule_day array
  if (!Array.isArray(schedule_day) || schedule_day.length === 0) {
    throw new Error('At least one schedule day must be provided');
  }

  // Check for trainer availability (basic check - same date and time)
  const existingClass = await prisma.classSchedule.findFirst({
    where: {
      trainer_id: parseInt(trainer_id),
      date: new Date(date),
      time: time,
      branchId: parseInt(branchId),
      status: 'Active',
    },
  });

  if (existingClass) {
    throw new Error('Trainer is already scheduled for this date and time');
  }

  const newClass = await prisma.classSchedule.create({
    data: {
      class_name,
      trainer_id: parseInt(trainer_id),
      date: new Date(date),
      time,
      schedule_day,
      total_sheets: total_sheets || 20,
      status: status || 'Active',
      branchId: parseInt(branchId),
      adminId: parseInt(userId), // Use userId instead of adminId
    },
    include: {
      trainer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      admin: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Log the creation
  logger.info(`Class created: ${newClass.class_name} by user ${userId} for branch ${branchId}`);

  return newClass;
};

const updateClass = async (id, classData, userId, branchId = null) => {
  const { class_name, trainer_id, date, time, schedule_day, total_sheets, status } = classData;

  // Validate schedule_day array if provided
  if (schedule_day && (!Array.isArray(schedule_day) || schedule_day.length === 0)) {
    throw new Error('At least one schedule day must be provided');
  }

  const where = { id: parseInt(id) };
  if (branchId) where.branchId = parseInt(branchId);

  // Check if class exists
  const existingClass = await prisma.classSchedule.findFirst({ where });
  if (!existingClass) {
    throw new Error('Class not found');
  }

  // Check for trainer availability if trainer or time changed
  if (trainer_id || date || time) {
    const checkDate = date ? new Date(date) : existingClass.date;
    const checkTime = time || existingClass.time;
    const checkTrainerId = trainer_id ? parseInt(trainer_id) : existingClass.trainer_id;

    const conflictingClass = await prisma.classSchedule.findFirst({
      where: {
        trainer_id: checkTrainerId,
        date: checkDate,
        time: checkTime,
        branchId: branchId ? parseInt(branchId) : existingClass.branchId,
        status: 'Active',
        id: { not: parseInt(id) }, // Exclude current class
      },
    });

    if (conflictingClass) {
      throw new Error('Trainer is already scheduled for this date and time');
    }
  }

  const updateData = {};
  if (class_name) updateData.class_name = class_name;
  if (trainer_id) updateData.trainer_id = parseInt(trainer_id);
  if (date) updateData.date = new Date(date);
  if (time) updateData.time = time;
  if (schedule_day) updateData.schedule_day = schedule_day;
  if (total_sheets) updateData.total_sheets = total_sheets;
  if (status) updateData.status = status;

  const updatedClass = await prisma.classSchedule.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      trainer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      admin: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Log the update
  logger.info(`Class updated: ${updatedClass.class_name} (ID: ${id}) by user ${userId}`);

  return updatedClass;
};

const deleteClass = async (id, userId, branchId = null) => {
  const where = { id: parseInt(id) };
  if (branchId) where.branchId = parseInt(branchId);

  const classToDelete = await prisma.classSchedule.findFirst({ where });
  if (!classToDelete) {
    throw new Error('Class not found');
  }

  await prisma.classSchedule.delete({ where: { id: parseInt(id) } });

  // Log the deletion
  logger.info(`Class deleted: ${classToDelete.class_name} (ID: ${id}) by user ${userId} for branch ${branchId || classToDelete.branchId}`);
};

const getTrainers = async (branchId = null) => {
  const where = {
    role: { in: ['generaltrainer', 'personaltrainer'] },
  };
  if (branchId) where.branchId = parseInt(branchId);

  return await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { firstName: 'asc' },
  });
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getTrainers,
};
