import { prisma } from '../config/db.config.js';

/** 🔹 GET All Tasks */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        staff: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role_id: true,
            status: true,
          },
        },
      },
      orderBy: { task_date: "desc" }, // use schema field name
    });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET Task by ID */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        staff: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role_id: true,
            status: true,
          },
        },
      },
    });

    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("❌ Error getting task:", error);
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE Task */
export const createTask = async (req, res) => {
  try {
    const { staff_id, category, task_title, description, task_date, status } = req.body;

    if (!staff_id || !category || !task_title || !description || !task_date) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: staff_id, category, task_title, description, task_date",
      });
    }

    const validStatuses = ["PENDING", "INPROGRESS", "COMPLETED"];
    const cleanStatus = status ? status.toUpperCase() : "PENDING";

    if (!validStatuses.includes(cleanStatus)) {
      return res.status(400).json({ success: false, error: `Invalid status. Allowed: ${validStatuses.join(", ")}` });
    }

    const newTask = await prisma.task.create({
      data: {
        staff_id: parseInt(staff_id),
        category,
        task_title,
        description,
        task_date: new Date(task_date),
        status: cleanStatus,
      },
    });

    res.status(201).json({ success: true, message: "Task created ✅", data: newTask });
  } catch (error) {
    console.error("❌ Create Task Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE Task */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, task_title, description, task_date, status, completed_at } = req.body;

    const validStatuses = ["PENDING", "INPROGRESS", "COMPLETED"];
    let cleanStatus = status ? status.toUpperCase() : undefined;
    if (cleanStatus && !validStatuses.includes(cleanStatus)) {
      return res.status(400).json({ success: false, error: `Invalid status. Allowed: ${validStatuses.join(", ")}` });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        category: category || undefined,
        task_title: task_title || undefined,
        description: description || undefined,
        task_date: task_date ? new Date(task_date) : undefined,
        status: cleanStatus || undefined,
        completed_at: completed_at ? new Date(completed_at) : undefined,
      },
    });

    res.status(200).json({ success: true, message: "Task updated ✅", data: updatedTask });
  } catch (error) {
    console.error("❌ Update Task Error:", error);
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "Task not found" });
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE Task */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ success: true, message: "Task deleted 🗑️" });
  } catch (error) {
    console.error("❌ Delete Task Error:", error);
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "Task not found" });
    res.status(500).json({ error: error.message });
  }
};
