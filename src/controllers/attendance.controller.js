import prisma from "../prisma/client.js";

// Get all attendances
export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        member: true,
      },
    });
    res.status(200).json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get attendance by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await prisma.attendance.findUnique({
      where: { id: Number(id) },
      include: {
        member: true,
      },
    });

    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new attendance
export const createAttendance = async (req, res) => {
  try {
    const { memberId, checkIn, checkOut } = req.body;

    if (!memberId || !checkIn) {
      return res.status(400).json({ error: "memberId and checkIn are required" });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        memberId: Number(memberId),
        checkIn: new Date(checkIn),
        checkOut: checkOut ? new Date(checkOut) : undefined,
      },
    });

    res.status(201).json(newAttendance);
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId, checkIn, checkOut } = req.body;

    const updatedAttendance = await prisma.attendance.update({
      where: { id: Number(id) },
      data: {
        memberId: memberId ? Number(memberId) : undefined,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
      },
    });

    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Attendance not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete attendance
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.attendance.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting attendance:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Attendance not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};
