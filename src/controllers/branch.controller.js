import prisma from "../prisma/client.js";

// Get all branches
export const getAllBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        members: true,
        staff: true,
        classes: true,
      },
    });
    res.status(200).json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get branch by ID
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await prisma.branch.findUnique({
      where: { id: Number(id) },
      include: {
        members: true,
        staff: true,
        classes: true,
      },
    });

    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.status(200).json(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new branch
export const createBranch = async (req, res) => {
  try {
    const { name, code, address, status } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: "name and code are required" });
    }

    const newBranch = await prisma.branch.create({
      data: { name, code, address, status },
    });

    res.status(201).json(newBranch);
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update branch
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, address, status } = req.body;

    const updatedBranch = await prisma.branch.update({
      where: { id: Number(id) },
      data: { name, code, address, status },
    });

    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error("Error updating branch:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Branch not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete branch
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.branch.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting branch:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Branch not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
