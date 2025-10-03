import prisma from "../prisma/client.js";

// Get all permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        role: true,
      },
    });
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permission.findUnique({
      where: { id: Number(id) },
      include: {
        role: true,
      },
    });

    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    res.status(200).json(permission);
  } catch (error) {
    console.error("Error fetching permission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new permission
export const createPermission = async (req, res) => {
  try {
    const { action, resource, roleId } = req.body;

    if (!action || !resource || !roleId) {
      return res.status(400).json({ error: "action, resource, and roleId are required" });
    }

    const newPermission = await prisma.permission.create({
      data: {
        action,
        resource,
        roleId: Number(roleId),
      },
    });

    res.status(201).json(newPermission);
  } catch (error) {
    console.error("Error creating permission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update permission
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, resource, roleId } = req.body;

    const updatedPermission = await prisma.permission.update({
      where: { id: Number(id) },
      data: {
        action,
        resource,
        roleId: roleId ? Number(roleId) : undefined,
      },
    });

    res.status(200).json(updatedPermission);
  } catch (error) {
    console.error("Error updating permission:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Permission not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete permission
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.permission.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting permission:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Permission not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
};
