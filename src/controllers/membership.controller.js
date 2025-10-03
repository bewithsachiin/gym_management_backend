import prisma from "../prisma/client.js";

// Get all memberships
export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await prisma.membership.findMany({
      include: {
        member: true,
        plan: true,
      },
    });
    res.status(200).json(memberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get membership by ID
export const getMembershipById = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await prisma.membership.findUnique({
      where: { id: Number(id) },
      include: {
        member: true,
        plan: true,
      },
    });

    if (!membership) {
      return res.status(404).json({ error: "Membership not found" });
    }

    res.status(200).json(membership);
  } catch (error) {
    console.error("Error fetching membership:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new membership
export const createMembership = async (req, res) => {
  try {
    const { startDate, endDate, status, memberId, planId } = req.body;

    if (!startDate || !endDate || !memberId || !planId) {
      return res.status(400).json({ error: "startDate, endDate, memberId, and planId are required" });
    }

    const newMembership = await prisma.membership.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        memberId: Number(memberId),
        planId: Number(planId),
      },
    });

    res.status(201).json(newMembership);
  } catch (error) {
    console.error("Error creating membership:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update membership
export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, status, memberId, planId } = req.body;

    const updatedMembership = await prisma.membership.update({
      where: { id: Number(id) },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        memberId: memberId ? Number(memberId) : undefined,
        planId: planId ? Number(planId) : undefined,
      },
    });

    res.status(200).json(updatedMembership);
  } catch (error) {
    console.error("Error updating membership:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Membership not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete membership
export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.membership.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting membership:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Membership not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
};
