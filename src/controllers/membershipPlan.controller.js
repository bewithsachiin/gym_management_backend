import prisma from "../prisma/client.js";

// Get all membership plans
export const getAllMembershipPlans = async (req, res) => {
  try {
    const plans = await prisma.membershipPlan.findMany({
      include: {
        memberships: true,
      },
    });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get membership plan by ID
export const getMembershipPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: Number(id) },
      include: {
        memberships: true,
      },
    });

    if (!plan) {
      return res.status(404).json({ error: "Membership plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching membership plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new membership plan
export const createMembershipPlan = async (req, res) => {
  try {
    const { name, description, durationDays, price, features, status } = req.body;

    if (!name || !durationDays || !price) {
      return res.status(400).json({ error: "name, durationDays, and price are required" });
    }

    const newPlan = await prisma.membershipPlan.create({
      data: {
        name,
        description,
        durationDays: Number(durationDays),
        price: parseFloat(price),
        features,
        status,
      },
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error("Error creating membership plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update membership plan
export const updateMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, durationDays, price, features, status } = req.body;

    const updatedPlan = await prisma.membershipPlan.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        durationDays: durationDays ? Number(durationDays) : undefined,
        price: price ? parseFloat(price) : undefined,
        features,
        status,
      },
    });

    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error updating membership plan:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Membership plan not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete membership plan
export const deleteMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.membershipPlan.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting membership plan:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Membership plan not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllMembershipPlans,
  getMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};
