const { PrismaClient } = require('@prisma/client');
const cloudinary = require('../config/cloudinary');

const prisma = new PrismaClient();

const getAllBranches = async () => {
  return await prisma.branch.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      phone: true,
      email: true,
      status: true,
      hours: true,
      branch_image: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

const createBranch = async (data, createdById) => {
  const { name, code, address, phone, email, status, hours, branch_image, adminId } = data;

  // Validate adminId is provided
  if (!adminId) {
    throw new Error('adminId is required to create a branch');
  }

  // Check if admin exists and is role 'admin' or 'superadmin'
  const admin = await prisma.user.findUnique({
    where: { id: parseInt(adminId) },
  });

  if (!admin) {
    throw new Error('Admin user not found');
  }

  if (!['admin', 'superadmin'].includes(admin.role)) {
    throw new Error('Assigned user must be an admin or superadmin');
  }

  // Check if admin already has a branch (only for regular admins, superadmin can have multiple)
  if (admin.role === 'admin' && admin.branchId) {
    throw new Error('Admin is already assigned to a branch');
  }

  // Map status to enum
  const statusEnum = status === 'Active' ? 'ACTIVE' : status === 'Inactive' ? 'INACTIVE' : status === 'Maintenance' ? 'MAINTENANCE' : 'INACTIVE';

  // Create branch and update admin's branchId in transaction
  const result = await prisma.$transaction(async (prisma) => {
    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        address,
        phone,
        email,
        status: statusEnum,
        hours,
        branch_image,
        adminId: parseInt(adminId),
        createdById: createdById ? parseInt(createdById) : null,
      },
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        phone: true,
        email: true,
        status: true,
        hours: true,
        branch_image: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Update admin's branchId (only for regular admins, superadmin doesn't need branchId update)
    if (admin.role === 'admin') {
      await prisma.user.update({
        where: { id: parseInt(adminId) },
        data: { branchId: branch.id },
      });
    }

    return branch;
  });

  return result;
};

const updateBranch = async (id, data) => {
  const { name, code, address, phone, email, status, hours, branch_image } = data;

  // Map status to enum
  const statusEnum = status === 'Active' ? 'ACTIVE' : status === 'Inactive' ? 'INACTIVE' : status === 'Maintenance' ? 'MAINTENANCE' : 'INACTIVE';

  const updateData = {
    name,
    code,
    address,
    phone,
    email,
    status: statusEnum,
    hours,
    branch_image,
  };

  // If new image, delete old one from Cloudinary
  if (branch_image) {
    const existingBranch = await prisma.branch.findUnique({ where: { id: parseInt(id) } });
    if (existingBranch && existingBranch.branch_image) {
      const publicId = existingBranch.branch_image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
  }

  return await prisma.branch.update({
    where: { id: parseInt(id) },
    data: updateData,
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      phone: true,
      email: true,
      status: true,
      hours: true,
      branch_image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteBranch = async (id) => {
  const branch = await prisma.branch.findUnique({ where: { id: parseInt(id) } });
  if (branch && branch.branch_image) {
    const publicId = branch.branch_image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  }

  await prisma.branch.delete({ where: { id: parseInt(id) } });
};

const getBranchById = async (id) => {
  return await prisma.branch.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      phone: true,
      email: true,
      status: true,
      hours: true,
      branch_image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
