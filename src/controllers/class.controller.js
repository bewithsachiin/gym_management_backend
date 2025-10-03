import prisma from "../prisma/client.js";

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        branch: true,
        sessions: true,
      },
    });
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get class by ID
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classItem = await prisma.class.findUnique({
      where: { id: Number(id) },
      include: {
        branch: true,
        sessions: true,
      },
    });

    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json(classItem);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new class
export const createClass = async (req, res) => {
  try {
    const { name, description, capacity, schedule, status, branchId } = req.body;

    if (!name || !capacity || !branchId) {
      return res.status(400).json({ error: "name, capacity, and branchId are required" });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        capacity: Number(capacity),
        schedule,
        status,
        branchId: Number(branchId),
      },
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, capacity, schedule, status, branchId } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        capacity: capacity ? Number(capacity) : undefined,
        schedule,
        status,
        branchId: branchId ? Number(branchId) : undefined,
      },
    });

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.class.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting class:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
