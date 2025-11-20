const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllGroups = async (branchId = null) => {
  try {
    const where = branchId ? { branchId: parseInt(branchId) } : {};

    const groups = await prisma.group.findMany({
      where,
      include: {
        _count: {
          select: { members: true }
        },
        branch: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return groups.map(group => ({
      id: group.id,
      name: group.name,
      photo: group.photo,
      total: group._count.members,
      branchId: group.branchId,
      branch: group.branch
    }));
  } catch (error) {
    throw new Error(`Error fetching groups: ${error.message}`);
  }
};

const getGroupById = async (id, branchId) => {
  try {
    const group = await prisma.group.findFirst({
      where: { id: parseInt(id), branchId },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!group) {
      throw new Error('Group not found');
    }

    return {
      id: group.id,
      name: group.name,
      photo: group.photo,
      total: group._count.members,
      branchId: group.branchId
    };
  } catch (error) {
    throw new Error(`Error fetching group: ${error.message}`);
  }
};

const createGroup = async (data, branchId) => {
  try {
    const group = await prisma.group.create({
      data: {
        name: data.name,
        photo: data.photo,
        branchId
      },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    return {
      id: group.id,
      name: group.name,
      photo: group.photo,
      total: group._count.members,
      branchId: group.branchId
    };
  } catch (error) {
    throw new Error(`Error creating group: ${error.message}`);
  }
};

const updateGroup = async (id, data, branchId) => {
  try {
    const group = await prisma.group.updateMany({
      where: { id: parseInt(id), branchId },
      data: {
        name: data.name,
        photo: data.photo
      }
    });

    if (group.count === 0) {
      throw new Error('Group not found or not authorized');
    }

    // Fetch updated group with member count
    const updatedGroup = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    return {
      id: updatedGroup.id,
      name: updatedGroup.name,
      photo: updatedGroup.photo,
      total: updatedGroup._count.members,
      branchId: updatedGroup.branchId
    };
  } catch (error) {
    throw new Error(`Error updating group: ${error.message}`);
  }
};

const deleteGroup = async (id, branchId) => {
  try {
    // First, remove groupId from all members in this group
    await prisma.user.updateMany({
      where: { groupId: parseInt(id) },
      data: { groupId: null }
    });

    const group = await prisma.group.deleteMany({
      where: { id: parseInt(id), branchId }
    });

    if (group.count === 0) {
      throw new Error('Group not found or not authorized');
    }

    return { message: 'Group deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting group: ${error.message}`);
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup
};
