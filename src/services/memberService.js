// Member Service - Simple functions with detailed console logs
const bcrypt = require('bcrypt');
const prisma = require('../config/db');

// ============================================
// GET ALL MEMBERS
// ============================================
async function getAllMembers() {
  console.log('\n👥 [MEMBER SERVICE] Getting all members...');

  try {
    console.log('🔍 Fetching members from database...');
    const members = await prisma.user.findMany({
      where: { role: 'member' },
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
            name: true,
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

    console.log(`✅ Found ${members.length} members`);

    // Format data for response
    console.log('🔄 Formatting member data...');
    const formattedMembers = members.map(member => ({
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
      plan: member.plan ? member.plan.name : null,
      planId: member.plan ? member.plan.id : null,
      branch: member.branch,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }));

    console.log('✅ Member data formatted successfully');
    console.log('🎉 [MEMBER SERVICE] Get all members completed\n');

    return formattedMembers;

  } catch (error) {
    console.log('❌ [MEMBER SERVICE] Get all members failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error fetching members: ${error.message}`);
  }
}

// ============================================
// GET MEMBERS BY BRANCH
// ============================================
async function getMembersByBranch(branchId, searchTerm = '') {
  console.log('\n👥 [MEMBER SERVICE] Getting members by branch...');
  console.log('🏢 Branch ID:', branchId);
  console.log('🔍 Search term:', searchTerm);

  try {
    // Build search conditions
    const searchConditions = searchTerm ? [
      { firstName: { contains: searchTerm, mode: 'insensitive' } },
      { lastName: { contains: searchTerm, mode: 'insensitive' } },
      { memberId: { contains: searchTerm, mode: 'insensitive' } },
    ] : undefined;

    console.log('🔍 Fetching members from database...');
    const members = await prisma.user.findMany({
      where: {
        role: 'member',
        branchId: parseInt(branchId),
        OR: searchConditions,
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
            name: true,
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

    console.log(`✅ Found ${members.length} members in branch ${branchId}`);

    // Format data
    console.log('🔄 Formatting member data...');
    const formattedMembers = members.map(member => ({
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
      plan: member.plan ? member.plan.name : null,
      planId: member.plan ? member.plan.id : null,
      branch: member.branch,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }));

    console.log('✅ Member data formatted successfully');
    console.log('🎉 [MEMBER SERVICE] Get members by branch completed\n');

    return formattedMembers;

  } catch (error) {
    console.log('❌ [MEMBER SERVICE] Get members by branch failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error fetching members: ${error.message}`);
  }
}

// ============================================
// CREATE MEMBER
// ============================================
async function createMember(memberData, createdById, createdByRole) {
  console.log('\n➕ [MEMBER SERVICE] Creating new member...');
  console.log('📦 Member data:', memberData);
  console.log('👤 Created by:', createdById, 'Role:', createdByRole);

  try {
    const {
      first_name,
      last_name,
      middle_name,
      email,
      password,
      phone,
      gender,
      dob,
      address,
      city,
      state,
      profile_photo,
      joiningDate,
      expireDate,
      memberType,
      memberStatus,
      membershipStatus,
      planId,
      branchId,
      weight,
      height,
      chest,
      waist,
      thigh,
      arms,
      fat,
    } = memberData;

    // Step 1: Check if email already exists
    console.log('🔍 Step 1: Checking if email exists...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ Email already exists:', email);
      throw new Error('Email already exists');
    }
    console.log('✅ Email is available');

    // Step 2: Generate member ID
    console.log('🔍 Step 2: Generating member ID...');
    const lastMember = await prisma.user.findFirst({
      where: { role: 'member' },
      orderBy: { id: 'desc' },
    });

    const nextId = lastMember && lastMember.memberId
      ? parseInt(lastMember.memberId.replace('MEM', '')) + 1
      : 1;
    const memberId = `MEM${String(nextId).padStart(4, '0')}`;
    console.log('✅ Generated member ID:', memberId);

    // Step 3: Hash password
    console.log('🔍 Step 3: Hashing password...');
    const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('password123', 10);
    console.log('✅ Password hashed successfully');

    // Step 4: Create member in database
    console.log('🔍 Step 4: Creating member in database...');
    const newMember = await prisma.user.create({
      data: {
        firstName: first_name,
        lastName: last_name,
        middleName: middle_name,
        email,
        password: hashedPassword,
        phone,
        gender,
        dob: dob ? new Date(dob) : null,
        address,
        city,
        state,
        profile_photo,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        expireDate: expireDate ? new Date(expireDate) : null,
        memberType: memberType || 'Member',
        memberStatus: memberStatus || 'Active',
        membershipStatus: membershipStatus || 'Activate',
        planId: planId ? parseInt(planId) : null,
        branchId: branchId ? parseInt(branchId) : null,
        memberId,
        role: 'member',
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        thigh: thigh ? parseFloat(thigh) : null,
        arms: arms ? parseFloat(arms) : null,
        fat: fat ? parseFloat(fat) : null,
        createdBy: createdByRole,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
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

    console.log('✅ Member created successfully:', {
      id: newMember.id,
      memberId: newMember.memberId,
      email: newMember.email
    });

    // Step 5: Format response
    console.log('🔍 Step 5: Formatting response...');
    const formattedMember = {
      id: newMember.id,
      name: `${newMember.firstName} ${newMember.middleName || ''} ${newMember.lastName}`.trim(),
      first_name: newMember.firstName,
      last_name: newMember.lastName,
      middle_name: newMember.middleName,
      email: newMember.email,
      memberId: newMember.memberId,
      phone: newMember.phone,
      photo: newMember.profile_photo,
      joiningDate: newMember.joiningDate ? newMember.joiningDate.toISOString().split('T')[0] : null,
      expireDate: newMember.expireDate ? newMember.expireDate.toISOString().split('T')[0] : null,
      type: newMember.memberType,
      status: newMember.memberStatus,
      membershipStatus: newMember.membershipStatus,
      plan: newMember.plan,
      branch: newMember.branch,
      createdAt: newMember.createdAt,
      updatedAt: newMember.updatedAt,
    };

    console.log('✅ Response formatted successfully');
    console.log('🎉 [MEMBER SERVICE] Create member completed\n');

    return formattedMember;

  } catch (error) {
    console.log('❌ [MEMBER SERVICE] Create member failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error creating member: ${error.message}`);
  }
}

// ============================================
// UPDATE MEMBER
// ============================================
async function updateMember(id, memberData) {
  console.log('\n✏️ [MEMBER SERVICE] Updating member...');
  console.log('🆔 Member ID:', id);
  console.log('📦 Update data:', memberData);

  try {
    // Step 1: Check if member exists
    console.log('🔍 Step 1: Checking if member exists...');
    const existingMember = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingMember) {
      console.log('❌ Member not found with ID:', id);
      throw new Error('Member not found');
    }
    console.log('✅ Member found');

    // Step 2: Prepare update data
    console.log('🔍 Step 2: Preparing update data...');
    const updateData = {};

    if (memberData.first_name) updateData.firstName = memberData.first_name;
    if (memberData.last_name) updateData.lastName = memberData.last_name;
    if (memberData.middle_name !== undefined) updateData.middleName = memberData.middle_name;
    if (memberData.email) updateData.email = memberData.email;
    if (memberData.phone) updateData.phone = memberData.phone;
    if (memberData.gender) updateData.gender = memberData.gender;
    if (memberData.dob) updateData.dob = new Date(memberData.dob);
    if (memberData.address) updateData.address = memberData.address;
    if (memberData.city) updateData.city = memberData.city;
    if (memberData.state) updateData.state = memberData.state;
    if (memberData.profile_photo) updateData.profile_photo = memberData.profile_photo;
    if (memberData.joiningDate) updateData.joiningDate = new Date(memberData.joiningDate);
    if (memberData.expireDate) updateData.expireDate = new Date(memberData.expireDate);
    if (memberData.memberType) updateData.memberType = memberData.memberType;
    if (memberData.memberStatus) updateData.memberStatus = memberData.memberStatus;
    if (memberData.membershipStatus) updateData.membershipStatus = memberData.membershipStatus;
    if (memberData.planId) updateData.planId = parseInt(memberData.planId);
    if (memberData.branchId) updateData.branchId = parseInt(memberData.branchId);
    if (memberData.weight) updateData.weight = parseFloat(memberData.weight);
    if (memberData.height) updateData.height = parseFloat(memberData.height);
    if (memberData.chest) updateData.chest = parseFloat(memberData.chest);
    if (memberData.waist) updateData.waist = parseFloat(memberData.waist);
    if (memberData.thigh) updateData.thigh = parseFloat(memberData.thigh);
    if (memberData.arms) updateData.arms = parseFloat(memberData.arms);
    if (memberData.fat) updateData.fat = parseFloat(memberData.fat);

    console.log('✅ Update data prepared:', Object.keys(updateData));

    // Step 3: Update member
    console.log('🔍 Step 3: Updating member in database...');
    const updatedMember = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
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

    console.log('✅ Member updated successfully');

    // Step 4: Format response
    const formattedMember = {
      id: updatedMember.id,
      name: `${updatedMember.firstName} ${updatedMember.middleName || ''} ${updatedMember.lastName}`.trim(),
      first_name: updatedMember.firstName,
      last_name: updatedMember.lastName,
      middle_name: updatedMember.middleName,
      email: updatedMember.email,
      memberId: updatedMember.memberId,
      phone: updatedMember.phone,
      photo: updatedMember.profile_photo,
      joiningDate: updatedMember.joiningDate ? updatedMember.joiningDate.toISOString().split('T')[0] : null,
      expireDate: updatedMember.expireDate ? updatedMember.expireDate.toISOString().split('T')[0] : null,
      type: updatedMember.memberType,
      status: updatedMember.memberStatus,
      membershipStatus: updatedMember.membershipStatus,
      plan: updatedMember.plan,
      branch: updatedMember.branch,
      createdAt: updatedMember.createdAt,
      updatedAt: updatedMember.updatedAt,
    };

    console.log('🎉 [MEMBER SERVICE] Update member completed\n');
    return formattedMember;

  } catch (error) {
    console.log('❌ [MEMBER SERVICE] Update member failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error updating member: ${error.message}`);
  }
}

// ============================================
// DELETE MEMBER
// ============================================
async function deleteMember(id) {
  console.log('\n🗑️ [MEMBER SERVICE] Deleting member...');
  console.log('🆔 Member ID:', id);

  try {
    // Step 1: Check if member exists
    console.log('🔍 Step 1: Checking if member exists...');
    const existingMember = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingMember) {
      console.log('❌ Member not found with ID:', id);
      throw new Error('Member not found');
    }
    console.log('✅ Member found');

    // Step 2: Delete member
    console.log('🔍 Step 2: Deleting member from database...');
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    console.log('✅ Member deleted successfully');
    console.log('🎉 [MEMBER SERVICE] Delete member completed\n');

  } catch (error) {
    console.log('❌ [MEMBER SERVICE] Delete member failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error deleting member: ${error.message}`);
  }
}

// Export all functions
module.exports = {
  getAllMembers,
  getMembersByBranch,
  createMember,
  updateMember,
  deleteMember,
};
