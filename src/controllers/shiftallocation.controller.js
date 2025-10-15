import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ------------------- CREATE -------------------
export const createShiftAllocation = async (req, res) => {
  try {
    const { staff_id, shift_type, date, start_time, end_time, break_start, break_end } = req.body;

    if (!staff_id || !shift_type || !date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "staff_id, shift_type, date, start_time, and end_time are required",
      });
    }

    const allocation = await prisma.shiftAllocation.create({
      data: {
        staff_id,
        shift_type,
        date: new Date(date),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        break_start: break_start ? new Date(break_start) : null,
        break_end: break_end ? new Date(break_end) : null,
      },
    });

    res.status(201).json({ success: true, data: allocation });
  } catch (error) {
    console.error("Error creating shift allocation:", error);
    res.status(500).json({ success: false, message: "Failed to create shift allocation", error: error.message });
  }
};

// ------------------- GET ALL -------------------
export const getAllShiftAllocations = async (_req, res) => {
  try {
    const allocations = await prisma.shiftAllocation.findMany({
      orderBy: { date: "desc" },
      include: { staff: true }, // Include staff details
    });
    res.json({ success: true, data: allocations });
  } catch (error) {
    console.error("Error fetching shift allocations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shift allocations", error: error.message });
  }
};

// ------------------- GET BY ID -------------------
export const getShiftAllocationById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const allocation = await prisma.shiftAllocation.findUnique({
      where: { id },
      include: { staff: true },
    });

    if (!allocation) return res.status(404).json({ success: false, message: "Shift allocation not found" });

    res.json({ success: true, data: allocation });
  } catch (error) {
    console.error("Error fetching shift allocation:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shift allocation", error: error.message });
  }
};

// ------------------- UPDATE -------------------
export const updateShiftAllocation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { staff_id, shift_type, date, start_time, end_time, break_start, break_end } = req.body;

    const data = {};
    if (staff_id !== undefined) data.staff_id = staff_id;
    if (shift_type !== undefined) data.shift_type = shift_type;
    if (date !== undefined) data.date = new Date(date);
    if (start_time !== undefined) data.start_time = new Date(start_time);
    if (end_time !== undefined) data.end_time = new Date(end_time);
    if (break_start !== undefined) data.break_start = break_start ? new Date(break_start) : null;
    if (break_end !== undefined) data.break_end = break_end ? new Date(break_end) : null;

    const updated = await prisma.shiftAllocation.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating shift allocation:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Shift allocation not found" });
    }
    res.status(500).json({ success: false, message: "Failed to update shift allocation", error: error.message });
  }
};

// ------------------- DELETE -------------------
export const deleteShiftAllocation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.shiftAllocation.delete({ where: { id } });
    res.json({ success: true, message: "Shift allocation deleted successfully" });
  } catch (error) {
    console.error("Error deleting shift allocation:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Shift allocation not found" });
    }
    res.status(500).json({ success: false, message: "Failed to delete shift allocation", error: error.message });
  }
};
