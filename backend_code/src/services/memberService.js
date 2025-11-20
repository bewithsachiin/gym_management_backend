/**
 * Member Service Module
 *
 * This module handles all business logic related to gym members.
 * It provides functions to create, read, update, delete, and manage member data.
 * The service interacts with the Prisma ORM to perform database operations.
 *
 * Key Features:
 * - Member CRUD operations
 * - Membership activation/deactivation
 * - Data mapping between database and frontend formats
 * - Branch-based filtering for multi-branch support
 * - Search functionality across member fields
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');

const prisma = new PrismaClient();

/**
 * Get members with optional branch filter and search
 * @param {number|null} branchId - Branch ID to filter members (null for all branches)
 * @param {string} searchTerm - Search term for name, memberId, or plan
 * @returns {Array} Array of member objects matching frontend structure
 */
const getMembers = async (branchId = null, searchTerm = '') => {
  // Build where clause for database query
  const where = { role: 'member' };

  // Filter by branch if provided
  if (branchId) {
    where.branchId = parseInt(branchId);
  }

  // Add search filters if search term is provided
  if (searchTerm) {
    where.OR = [
      { firstName: { contains: searchTerm, mode: 'insensitive' } },
      { lastName: { contains: searchTerm, mode: 'insensitive' } },
      { memberId: { contains: searchTerm, mode: 'insensitive' } },
      { plan: { plan_name: { contains: searchTerm, mode: 'insensitive' } } }
    ];
  }

  // Fetch members from database with related data
  const members = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      middleName: true,
      email: true,
      memberId: true,
      phone: true,
      profile_photo: true,
      joiningDate: true,
      expireDate: true,
      memberType: true,
      memberStatus: true,
      membershipStatus: true,
      plan: {
        select: {
          id: true,
          plan_name: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  // Map database data to frontend structure
  return members.map(member => ({
    id: member.id,
    name: `${member.firstName} ${member.middleName || ''} ${member.lastName}`.trim(), // Full name
    memberId: member.memberId,
    joiningDate: member.joiningDate ? member.joiningDate.toISOString().split('T')[0] : null, // Format as YYYY-MM-DD
    expireDate: member.expireDate ? member.expireDate.toISOString().split('T')[0] : null,
    type: member.memberType || 'Member',
    status: member.memberStatus === 'Active' ? 'Continue' : 'Prospect', // Map to frontend status
    membershipStatus: member.membershipStatus || 'Activate', // 'Activated' or 'Activate'
    photo: member.profile_photo || '',
    plan: member.plan ? member.plan.plan_name : 'Basic', // Plan name as string, default to 'Basic'
  }));
};

const getMembersByBranch = async (branchId, searchTerm = '') => {
  const members = await prisma.user.findMany({
    where: {
      role: 'member',
      branchId: parseInt(branchId),
      OR: searchTerm ? [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { memberId: { contains: searchTerm, mode: 'insensitive' } },
        { plan: { plan_name: { contains: searchTerm, mode: 'insensitive' } } }
      ] : undefined,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      middleName: true,
      email: true,
      memberId: true,
      phone: true,
      profile_photo: true,
      joiningDate: true,
      expireDate: true,
      memberType: true,
      memberStatus: true,
      membershipStatus: true,
      plan: {
        select: {
          id: true,
          plan_name: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  // Flatten the data for consistency
  return members.map(member => ({
    id: member.id,
    name: `${member.firstName} ${member.middleName || ''} ${member.lastName}`.trim(),
    first_name: member.firstName,
    last_name: member.lastName,
    middle_name: member.middleName,
    email: member.email,
    memberId: member.memberId,
    phone: member.phone,
    photo: member.profile_photo,
    joiningDate: member.joiningDate ? member.joiningDate.toISOString().split('T')[0] : null,
    expireDate: member.expireDate ? member.expireDate.toISOString().split('T')[0] : null,
    type: member.memberType || 'Member',
    status: member.memberStatus || 'Active',
    membershipStatus: member.membershipStatus || 'Activate',
    plan: member.plan ? member.plan.plan_name : null,
    planId: member.plan ? member.plan.id : null,
    branch: member.branch,
    staff: null, // No staff relation in User
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  }));
};

const createMember = async (data, createdById, createdByRole) => {
  const {
    firstName,
    middleName,
    lastName,
    memberId,
    gender,
    dob,
    address,
    city,
    state,
    mobile,
    email,
    username,
    password,
    weight,
    height,
    chest,
    waist,
    thigh,
    arms,
    fat,
    plan,
    joiningDate,
    expireDate,
    branchId,
    photo,
  } = data;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    throw new Error('First name, last name, email, and password are required');
  }

  // Generate unique memberId if not provided
  let finalMemberId = memberId;
  if (!finalMemberId) {
    const lastMember = await prisma.user.findFirst({
      where: { role: 'member' },
      orderBy: { id: 'desc' },
      select: { memberId: true }
    });
    const nextId = lastMember && lastMember.memberId ? parseInt(lastMember.memberId.replace('M', '')) + 1 : 10001;
    finalMemberId = `M${nextId}`;
  }

  // Check if memberId is unique
  const existingMember = await prisma.user.findUnique({
    where: { memberId: finalMemberId }
  });
  if (existingMember) {
    throw new Error('Member ID already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Find plan if provided
  let planId = null;
  if (plan) {
    const planRecord = await prisma.plan.findFirst({
      where: { plan_name: plan }
    });
    planId = planRecord ? planRecord.id : null;
  }

  // Create User with comprehensive member data
  const user = await prisma.user.create({
    data: {
      firstName,
      middleName: middleName || null,
      lastName,
      email,
      password: hashedPassword,
      role: 'member',
      branchId: parseInt(branchId),

      // Extended member fields
      memberId: finalMemberId,
      gender,
      dob: dob ? new Date(dob) : null,
      phone: mobile,
      address,
      city,
      state,
      profile_photo: photo,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      expireDate: expireDate ? new Date(expireDate) : null,
      memberType: 'Member',
      memberStatus: 'Active',
      membershipStatus: 'Activate',
      planId,

      // Physical measurements
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      chest: chest ? parseFloat(chest) : null,
      waist: waist ? parseFloat(waist) : null,
      thigh: thigh ? parseFloat(thigh) : null,
      arms: arms ? parseFloat(arms) : null,
      fat: fat ? parseFloat(fat) : null,

      // Login credentials
      username: username || null,
      loginEnabled: username ? true : false,

      // Audit field
      createdBy: createdByRole,
    },
    include: {
      plan: {
        select: {
          id: true,
          plan_name: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Flatten the data for consistency
  return {
    id: user.id,
    name: `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim(),
    first_name: user.firstName,
    last_name: user.lastName,
    middle_name: user.middleName,
    email: user.email,
    memberId: user.memberId,
    phone: user.phone,
    photo: user.profile_photo,
    joiningDate: user.joiningDate ? user.joiningDate.toISOString().split('T')[0] : null,
    expireDate: user.expireDate ? user.expireDate.toISOString().split('T')[0] : null,
    type: user.memberType,
    status: user.memberStatus,
    membershipStatus: user.membershipStatus,
    plan: user.plan ? user.plan.plan_name : null,
    planId: user.plan ? user.plan.id : null,
    branch: user.branch,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updateMember = async (id, data) => {
  const {
    firstName,
    middleName,
    lastName,
    memberId,
    gender,
    dob,
    address,
    city,
    state,
    mobile,
    email,
    username,
    password,
    weight,
    height,
    chest,
    waist,
    thigh,
    arms,
    fat,
    plan,
    joiningDate,
    expireDate,
    branchId,
    photo,
    membershipStatus,
  } = data;

  const member = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  // Check memberId uniqueness if changed
  if (memberId && memberId !== member.memberId) {
    const existingMember = await prisma.user.findUnique({
      where: { memberId }
    });
    if (existingMember) {
      throw new Error('Member ID already exists');
    }
  }

  // Hash new password if provided
  let hashedPassword = member.password;
  if (password && password.trim() !== '') {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Find plan if provided
  let planId = member.planId;
  if (plan !== undefined) {
    if (plan) {
      const planRecord = await prisma.plan.findFirst({
        where: { plan_name: plan }
      });
      planId = planRecord ? planRecord.id : null;
    } else {
      planId = null;
    }
  }

  // Update User with comprehensive member data
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      firstName: firstName || member.firstName,
      middleName: middleName !== undefined ? middleName : member.middleName,
      lastName: lastName || member.lastName,
      email: email || member.email,
      password: hashedPassword,
      branchId: branchId ? parseInt(branchId) : member.branchId,

      // Extended member fields
      memberId: memberId || member.memberId,
      gender: gender !== undefined ? gender : member.gender,
      dob: dob ? new Date(dob) : member.dob,
      phone: mobile !== undefined ? mobile : member.phone,
      address: address !== undefined ? address : member.address,
      city: city !== undefined ? city : member.city,
      state: state !== undefined ? state : member.state,
      profile_photo: photo !== undefined ? photo : member.profile_photo,
      joiningDate: joiningDate ? new Date(joiningDate) : member.joiningDate,
      expireDate: expireDate ? new Date(expireDate) : member.expireDate,
      membershipStatus: membershipStatus || member.membershipStatus,
      planId,

      // Physical measurements
      weight: weight !== undefined ? (weight ? parseFloat(weight) : null) : member.weight,
      height: height !== undefined ? (height ? parseFloat(height) : null) : member.height,
      chest: chest !== undefined ? (chest ? parseFloat(chest) : null) : member.chest,
      waist: waist !== undefined ? (waist ? parseFloat(waist) : null) : member.waist,
      thigh: thigh !== undefined ? (thigh ? parseFloat(thigh) : null) : member.thigh,
      arms: arms !== undefined ? (arms ? parseFloat(arms) : null) : member.arms,
      fat: fat !== undefined ? (fat ? parseFloat(fat) : null) : member.fat,

      // Login credentials
      username: username !== undefined ? username : member.username,
      loginEnabled: username !== undefined ? (username ? true : false) : member.loginEnabled,
    },
    include: {
      plan: {
        select: {
          id: true,
          plan_name: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Flatten the data for consistency
  return {
    id: updatedUser.id,
    name: `${updatedUser.firstName} ${updatedUser.middleName || ''} ${updatedUser.lastName}`.trim(),
    first_name: updatedUser.firstName,
    last_name: updatedUser.lastName,
    middle_name: updatedUser.middleName,
    email: updatedUser.email,
    memberId: updatedUser.memberId,
    phone: updatedUser.phone,
    photo: updatedUser.profile_photo,
    joiningDate: updatedUser.joiningDate ? updatedUser.joiningDate.toISOString().split('T')[0] : null,
    expireDate: updatedUser.expireDate ? updatedUser.expireDate.toISOString().split('T')[0] : null,
    type: updatedUser.memberType,
    status: updatedUser.memberStatus,
    membershipStatus: updatedUser.membershipStatus,
    plan: updatedUser.plan ? updatedUser.plan.plan_name : null,
    planId: updatedUser.plan ? updatedUser.plan.id : null,
    branch: updatedUser.branch,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
};

/**
 * Toggle member activation status (Activate/Activated)
 * @param {number} id - Member ID
 * @returns {Object} Updated member object
 */
const activateMember = async (id) => {
  // Find the member
  const member = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  // Toggle membership status
  const newStatus = member.membershipStatus === 'Activate' ? 'Activated' : 'Activate';

  // Update the member
  const updatedMember = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { membershipStatus: newStatus },
    include: {
      plan: {
        select: {
          id: true,
          plan_name: true,
        },
      },
    },
  });

  // Return in frontend format
  return {
    id: updatedMember.id,
    name: `${updatedMember.firstName} ${updatedMember.middleName || ''} ${updatedMember.lastName}`.trim(),
    memberId: updatedMember.memberId,
    joiningDate: updatedMember.joiningDate ? updatedMember.joiningDate.toISOString().split('T')[0] : null,
    expireDate: updatedMember.expireDate ? updatedMember.expireDate.toISOString().split('T')[0] : null,
    type: updatedMember.memberType || 'Member',
    status: updatedMember.memberStatus === 'Active' ? 'Continue' : 'Prospect',
    membershipStatus: updatedMember.membershipStatus,
    photo: updatedMember.profile_photo || '',
    plan: updatedMember.plan ? updatedMember.plan.plan_name : 'Basic',
  };
};

const deleteMember = async (id) => {
  const member = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  // Delete User (members are just users with role 'member')
  await prisma.user.delete({ where: { id: parseInt(id) } });
};

module.exports = {
  getMembers,
  getMembersByBranch,
  createMember,
  updateMember,
  activateMember,
  deleteMember,
};
