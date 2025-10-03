import prisma from "../prisma/client.js";

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        users: true,
        permissions: true,
      },
    });
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get role by ID
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
      include: {
        users: true,
        permissions: true,
      },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new role
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedRole = await prisma.role.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
      },
    });

    res.status(200).json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.role.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting role:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
