// Staff Service - Simple functions with detailed console logs
const bcrypt = require('bcrypt');
const prisma = require('../config/db');

// ============================================
// GET ALL STAFF
// ============================================
async function getAllStaff() {
  console.log('\n👔 [STAFF SERVICE] Getting all staff...');

  try {
    console.log('🔍 Fetching staff from database...');
    const staffList = await prisma.staff.findMany({
      select: {
        id: true,
        staff_id: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        gender: true,
        dob: true,
        phone: true,
        profile_photo: true,
        status: true,
        role: {
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
        join_date: true,
        exit_date: true,
        salary_type: true,
        hourly_rate: true,
        fixed_salary: true,
        commission_rate_percent: true,
        login_enabled: true,
        username: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(`✅ Found ${staffList.length} staff members`);

    // Format data
    console.log('🔄 Formatting staff data...');
    const formattedStaff = staffList.map(staff => ({
      id: staff.id,
      staff_id: staff.staff_id,
      first_name: staff.user.firstName,
      last_name: staff.user.lastName,
      email: staff.user.email,
      gender: staff.gender,
      dob: staff.dob,
      phone: staff.phone,
      profile_photo: staff.profile_photo,
      status: staff.status,
      role: staff.role,
      branch: staff.branch,
      join_date: staff.join_date,
      exit_date: staff.exit_date,
      salary_type: staff.salary_type,
      hourly_rate: staff.hourly_rate,
      fixed_salary: staff.fixed_salary,
      commission_rate_percent: staff.commission_rate_percent,
      login_enabled: staff.login_enabled,
      username: staff.username,
      createdBy: staff.createdBy,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    }));

    console.log('✅ Staff data formatted successfully');
    console.log('🎉 [STAFF SERVICE] Get all staff completed\n');

    return formattedStaff;

  } catch (error) {
    console.log('❌ [STAFF SERVICE] Get all staff failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error fetching staff: ${error.message}`);
  }
}

// ============================================
// GET STAFF BY BRANCH
// ============================================
async function getStaffByBranch(branchId) {
  console.log('\n👔 [STAFF SERVICE] Getting staff by branch...');
  console.log('🏢 Branch ID:', branchId);

  try {
    console.log('🔍 Fetching staff from database...');
    const staffList = await prisma.staff.findMany({
      where: {
        branchId: parseInt(branchId),
      },
      select: {
        id: true,
        staff_id: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        gender: true,
        dob: true,
        phone: true,
        profile_photo: true,
        status: true,
        role: {
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
        join_date: true,
        exit_date: true,
        salary_type: true,
        hourly_rate: true,
        fixed_salary: true,
        commission_rate_percent: true,
        login_enabled: true,
        username: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(`✅ Found ${staffList.length} staff members in branch ${branchId}`);

    // Format data
    console.log('🔄 Formatting staff data...');
    const formattedStaff = staffList.map(staff => ({
      id: staff.id,
      staff_id: staff.staff_id,
      first_name: staff.user.firstName,
      last_name: staff.user.lastName,
      email: staff.user.email,
      gender: staff.gender,
      dob: staff.dob,
      phone: staff.phone,
      profile_photo: staff.profile_photo,
      status: staff.status,
      role: staff.role,
      branch: staff.branch,
      join_date: staff.join_date,
      exit_date: staff.exit_date,
      salary_type: staff.salary_type,
      hourly_rate: staff.hourly_rate,
      fixed_salary: staff.fixed_salary,
      commission_rate_percent: staff.commission_rate_percent,
      login_enabled: staff.login_enabled,
      username: staff.username,
      createdBy: staff.createdBy,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    }));

    console.log('✅ Staff data formatted successfully');
    console.log('🎉 [STAFF SERVICE] Get staff by branch completed\n');

    return formattedStaff;

  } catch (error) {
    console.log('❌ [STAFF SERVICE] Get staff by branch failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error fetching staff: ${error.message}`);
  }
}

// ============================================
// CREATE STAFF
// ============================================
async function createStaff(staffData, createdById) {
  console.log('\n➕ [STAFF SERVICE] Creating new staff...');
  console.log('📦 Staff data:', staffData);
  console.log('👤 Created by:', createdById);

  try {
    const {
      first_name,
      last_name,
      gender,
      dob,
      email,
      phone,
      profile_photo,
      status,
      roleId,
      branchId,
      join_date,
      exit_date,
      salary_type,
      hourly_rate,
      fixed_salary,
      commission_rate_percent,
      login_enabled,
      username,
      password,
    } = staffData;

    // Step 1: Generate staff_id
    console.log('🔍 Step 1: Generating staff ID...');
    const lastStaff = await prisma.staff.findFirst({
      orderBy: { id: 'desc' },
    });

    const nextId = lastStaff ? parseInt(lastStaff.staff_id.replace('STAFF', '')) + 1 : 1;
    const staff_id = `STAFF${String(nextId).padStart(3, '0')}`;
    console.log('✅ Generated staff ID:', staff_id);

    // Step 2: Hash password if provided
    console.log('🔍 Step 2: Hashing password...');
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log('✅ Password hashed successfully');
    } else {
      console.log('⚠️  No password provided');
    }

    // Step 3: Create User first
    console.log('🔍 Step 3: Creating user account...');
    const user = await prisma.user.create({
      data: {
        firstName: first_name,
        lastName: last_name,
        email,
        password: hashedPassword || await bcrypt.hash('password123', 10),
        role: 'admin', // Default role for staff
        branchId: branchId ? parseInt(branchId) : null,
      },
    });

    console.log('✅ User account created:', {
      id: user.id,
      email: user.email
    });

    // Step 4: Create Staff record
    console.log('🔍 Step 4: Creating staff record...');
    const staff = await prisma.staff.create({
      data: {
        userId: user.id,
        staff_id,
        gender,
        dob: dob ? new Date(dob) : null,
        phone,
        profile_photo,
        status: status || 'Active',
        roleId: parseInt(roleId),
        branchId: parseInt(branchId),
        join_date: join_date ? new Date(join_date) : new Date(),
        exit_date: exit_date ? new Date(exit_date) : null,
        salary_type,
        hourly_rate: hourly_rate ? parseFloat(hourly_rate) : null,
        fixed_salary: fixed_salary ? parseFloat(fixed_salary) : null,
        commission_rate_percent: commission_rate_percent ? parseFloat(commission_rate_percent) : 0,
        login_enabled: login_enabled || false,
        username,
        password: hashedPassword,
        createdById: createdById ? parseInt(createdById) : null,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        role: {
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

    console.log('✅ Staff record created successfully:', {
      id: staff.id,
      staff_id: staff.staff_id
    });

    // Step 5: Format response
    console.log('🔍 Step 5: Formatting response...');
    const formattedStaff = {
      id: staff.id,
      staff_id: staff.staff_id,
      first_name: staff.user.firstName,
      last_name: staff.user.lastName,
      email: staff.user.email,
      gender: staff.gender,
      dob: staff.dob,
      phone: staff.phone,
      profile_photo: staff.profile_photo,
      status: staff.status,
      role: staff.role,
      branch: staff.branch,
      join_date: staff.join_date,
      exit_date: staff.exit_date,
      salary_type: staff.salary_type,
      hourly_rate: staff.hourly_rate,
      fixed_salary: staff.fixed_salary,
      commission_rate_percent: staff.commission_rate_percent,
      login_enabled: staff.login_enabled,
      username: staff.username,
      createdBy: staff.createdBy,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };

    console.log('✅ Response formatted successfully');
    console.log('🎉 [STAFF SERVICE] Create staff completed\n');

    return formattedStaff;

  } catch (error) {
    console.log('❌ [STAFF SERVICE] Create staff failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error creating staff: ${error.message}`);
  }
}

// ============================================
// UPDATE STAFF
// ============================================
async function updateStaff(id, staffData) {
  console.log('\n✏️ [STAFF SERVICE] Updating staff...');
  console.log('🆔 Staff ID:', id);
  console.log('📦 Update data:', staffData);

  try {
    // Step 1: Check if staff exists
    console.log('🔍 Step 1: Checking if staff exists...');
    const existingStaff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!existingStaff) {
      console.log('❌ Staff not found with ID:', id);
      throw new Error('Staff not found');
    }
    console.log('✅ Staff found');

    // Step 2: Prepare update data for Staff
    console.log('🔍 Step 2: Preparing staff update data...');
    const staffUpdateData = {};

    if (staffData.gender) staffUpdateData.gender = staffData.gender;
    if (staffData.dob) staffUpdateData.dob = new Date(staffData.dob);
    if (staffData.phone) staffUpdateData.phone = staffData.phone;
    if (staffData.profile_photo) staffUpdateData.profile_photo = staffData.profile_photo;
    if (staffData.status) staffUpdateData.status = staffData.status;
    if (staffData.roleId) staffUpdateData.roleId = parseInt(staffData.roleId);
    if (staffData.branchId) staffUpdateData.branchId = parseInt(staffData.branchId);
    if (staffData.join_date) staffUpdateData.join_date = new Date(staffData.join_date);
    if (staffData.exit_date) staffUpdateData.exit_date = new Date(staffData.exit_date);
    if (staffData.salary_type) staffUpdateData.salary_type = staffData.salary_type;
    if (staffData.hourly_rate) staffUpdateData.hourly_rate = parseFloat(staffData.hourly_rate);
    if (staffData.fixed_salary) staffUpdateData.fixed_salary = parseFloat(staffData.fixed_salary);
    if (staffData.commission_rate_percent !== undefined) {
      staffUpdateData.commission_rate_percent = parseFloat(staffData.commission_rate_percent);
    }
    if (staffData.login_enabled !== undefined) staffUpdateData.login_enabled = staffData.login_enabled;
    if (staffData.username) staffUpdateData.username = staffData.username;
    if (staffData.password) {
      staffUpdateData.password = await bcrypt.hash(staffData.password, 10);
    }

    console.log('✅ Staff update data prepared:', Object.keys(staffUpdateData));

    // Step 3: Prepare update data for User
    console.log('🔍 Step 3: Preparing user update data...');
    const userUpdateData = {};

    if (staffData.first_name) userUpdateData.firstName = staffData.first_name;
    if (staffData.last_name) userUpdateData.lastName = staffData.last_name;
    if (staffData.email) userUpdateData.email = staffData.email;
    if (staffData.branchId) userUpdateData.branchId = parseInt(staffData.branchId);

    console.log('✅ User update data prepared:', Object.keys(userUpdateData));

    // Step 4: Update User if needed
    if (Object.keys(userUpdateData).length > 0) {
      console.log('🔍 Step 4: Updating user account...');
      await prisma.user.update({
        where: { id: existingStaff.userId },
        data: userUpdateData,
      });
      console.log('✅ User account updated');
    } else {
      console.log('⚠️  No user updates needed');
    }

    // Step 5: Update Staff
    console.log('🔍 Step 5: Updating staff record...');
    const updatedStaff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: staffUpdateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        role: {
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

    console.log('✅ Staff record updated successfully');

    // Step 6: Format response
    const formattedStaff = {
      id: updatedStaff.id,
      staff_id: updatedStaff.staff_id,
      first_name: updatedStaff.user.firstName,
      last_name: updatedStaff.user.lastName,
      email: updatedStaff.user.email,
      gender: updatedStaff.gender,
      dob: updatedStaff.dob,
      phone: updatedStaff.phone,
      profile_photo: updatedStaff.profile_photo,
      status: updatedStaff.status,
      role: updatedStaff.role,
      branch: updatedStaff.branch,
      join_date: updatedStaff.join_date,
      exit_date: updatedStaff.exit_date,
      salary_type: updatedStaff.salary_type,
      hourly_rate: updatedStaff.hourly_rate,
      fixed_salary: updatedStaff.fixed_salary,
      commission_rate_percent: updatedStaff.commission_rate_percent,
      login_enabled: updatedStaff.login_enabled,
      username: updatedStaff.username,
      createdBy: updatedStaff.createdBy,
      createdAt: updatedStaff.createdAt,
      updatedAt: updatedStaff.updatedAt,
    };

    console.log('🎉 [STAFF SERVICE] Update staff completed\n');
    return formattedStaff;

  } catch (error) {
    console.log('❌ [STAFF SERVICE] Update staff failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error updating staff: ${error.message}`);
  }
}

// ============================================
// DELETE STAFF
// ============================================
async function deleteStaff(id) {
  console.log('\n🗑️ [STAFF SERVICE] Deleting staff...');
  console.log('🆔 Staff ID:', id);

  try {
    // Step 1: Check if staff exists
    console.log('🔍 Step 1: Checking if staff exists...');
    const existingStaff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingStaff) {
      console.log('❌ Staff not found with ID:', id);
      throw new Error('Staff not found');
    }
    console.log('✅ Staff found');

    // Step 2: Delete staff (this will also delete the user due to cascade)
    console.log('🔍 Step 2: Deleting staff record...');
    await prisma.staff.delete({
      where: { id: parseInt(id) },
    });

    console.log('✅ Staff deleted successfully');

    // Step 3: Delete associated user
    console.log('🔍 Step 3: Deleting associated user account...');
    await prisma.user.delete({
      where: { id: existingStaff.userId },
    });

    console.log('✅ User account deleted successfully');
    console.log('🎉 [STAFF SERVICE] Delete staff completed\n');

  } catch (error) {
    console.log('❌ [STAFF SERVICE] Delete staff failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error deleting staff: ${error.message}`);
  }
}

// Export all functions
module.exports = {
  getAllStaff,
  getStaffByBranch,
  createStaff,
  updateStaff,
  deleteStaff,
};
