import { prisma } from '../config/db.config.js';

/** 🔹 GET All Classes */
export const getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        trainer: { select: { first_name: true, last_name: true } },
        branch: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("❌ Get All Classes Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/** 🔹 GET Class by ID */
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await prisma.class.findUnique({
      where: { id: parseInt(id) },
      include: {
        trainer: { select: { first_name: true, last_name: true } },
        branch: { select: { name: true } },
      },
    });

    if (!classData)
      return res.status(404).json({ success: false, error: "Class not found" });

    res.status(200).json({ success: true, data: classData });
  } catch (error) {
    console.error("❌ Get Class Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/** 🔹 CREATE Class */
export const createClass = async (req, res) => {
  try {
    const {
      class_name,
      class_id,
      trainer_id,
      branch_id,
      date,
      time,
      schedule_day,
      total_sheets,
      status,
    } = req.body;

    if (!class_name || !date || !time || !total_sheets) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: class_name, date, time, total_sheets",
      });
    }

    const newClass = await prisma.class.create({
      data: {
        class_id, // unique class ID
        class_name,
        trainer_id: trainer_id ? parseInt(trainer_id) : null,
        branch_id: branch_id ? parseInt(branch_id) : null,
        date: new Date(date),
        time: new Date(time),
        schedule_day,
        total_sheets: parseInt(total_sheets),
        status: status || "ACTIVE",
      },
      include: {
        trainer: { select: { first_name: true, last_name: true } },
        branch: { select: { name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Class created ✅",
      data: newClass,
    });
  } catch (error) {
    console.error("❌ Create Class Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/** 🔹 UPDATE Class */
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      class_name,
      trainer_id,
      branch_id,
      date,
      time,
      schedule_day,
      total_sheets,
      status,
    } = req.body;

    const dataToUpdate = {
      class_name: class_name || undefined,
      trainer_id: trainer_id ? parseInt(trainer_id) : undefined,
      branch_id: branch_id ? parseInt(branch_id) : undefined,
      date: date ? new Date(date) : undefined,
      time: time ? new Date(time) : undefined,
      schedule_day: schedule_day || undefined,
      total_sheets: total_sheets ? parseInt(total_sheets) : undefined,
      status: status || undefined,
    };

    const updatedClass = await prisma.class.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: {
        trainer: { select: { first_name: true, last_name: true } },
        branch: { select: { name: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: "Class updated ✅",
      data: updatedClass,
    });
  } catch (error) {
    console.error("❌ Update Class Error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Class not found" });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};

/** 🔹 DELETE Class */
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.class.delete({ where: { id: parseInt(id) } });

    res.status(200).json({
      success: true,
      message: "Class deleted 🗑️",
    });
  } catch (error) {
    console.error("❌ Delete Class Error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Class not found" });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};
