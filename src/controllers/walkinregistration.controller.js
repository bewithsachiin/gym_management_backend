import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ------------------- CREATE -------------------
export const createWalkinRegistration = async (req, res) => {
  try {
    const { full_name, phone_number, email, membership_plan_id, interested, time, notes } = req.body;

    if (!full_name || !phone_number || !time) {
      return res.status(400).json({
        success: false,
        message: "full_name, phone_number, and time are required",
      });
    }

    const walkin = await prisma.walkinregistration.create({
      data: {
        full_name,
        phone_number,
        email: email || null,
        membership_plan_id: membership_plan_id || null,
        interested: interested || null,
        time: new Date(time),
        notes: notes || null,
      },
    });

    res.status(201).json({ success: true, data: walkin });
  } catch (error) {
    console.error("Error creating walkin registration:", error);
    res.status(500).json({ success: false, message: "Failed to create walkin registration", error: error.message });
  }
};

// ------------------- GET ALL -------------------
export const getAllWalkinRegistrations = async (_req, res) => {
  try {
    const walkins = await prisma.walkinregistration.findMany({
      orderBy: { time: "desc" },
      include: { membershipplan: true },
    });
    res.json({ success: true, data: walkins });
  } catch (error) {
    console.error("Error fetching walkin registrations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch walkin registrations", error: error.message });
  }
};

// ------------------- GET BY ID -------------------
export const getWalkinRegistrationById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const walkin = await prisma.walkinregistration.findUnique({
      where: { id },
      include: { membershipplan: true },
    });

    if (!walkin) return res.status(404).json({ success: false, message: "Walk-in registration not found" });

    res.json({ success: true, data: walkin });
  } catch (error) {
    console.error("Error fetching walkin registration:", error);
    res.status(500).json({ success: false, message: "Failed to fetch walkin registration", error: error.message });
  }
};

// ------------------- UPDATE -------------------
export const updateWalkinRegistration = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { full_name, phone_number, email, membership_plan_id, interested, time, notes } = req.body;

    const data = {};
    if (full_name !== undefined) data.full_name = full_name;
    if (phone_number !== undefined) data.phone_number = phone_number;
    if (email !== undefined) data.email = email || null;
    if (membership_plan_id !== undefined) data.membership_plan_id = membership_plan_id || null;
    if (interested !== undefined) data.interested = interested || null;
    if (time !== undefined) data.time = new Date(time);
    if (notes !== undefined) data.notes = notes || null;

    const updated = await prisma.walkinregistration.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating walkin registration:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Walk-in registration not found" });
    }
    res.status(500).json({ success: false, message: "Failed to update walkin registration", error: error.message });
  }
};

// ------------------- DELETE -------------------
export const deleteWalkinRegistration = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.walkinregistration.delete({ where: { id } });
    res.json({ success: true, message: "Walk-in registration deleted successfully" });
  } catch (error) {
    console.error("Error deleting walkin registration:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Walk-in registration not found" });
    }
    res.status(500).json({ success: false, message: "Failed to delete walkin registration", error: error.message });
  }
};
