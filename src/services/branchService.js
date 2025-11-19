// Branch Service - Simple functions with detailed console logs
const prisma = require('../config/db');

// ============================================
// GET ALL BRANCHES
// ============================================
async function getAllBranches() {
  console.log('\n🏢 [BRANCH SERVICE] Getting all branches...');

  try {
    console.log('🔍 Fetching branches from database...');
    const branches = await prisma.branch.findMany({
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

    console.log(`✅ Found ${branches.length} branches`);
    console.log('🎉 [BRANCH SERVICE] Get all branches completed\n');

    return branches;

  } catch (error) {
    console.log('❌ [BRANCH SERVICE] Get all branches failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error fetching branches: ${error.message}`);
  }
}

// ============================================
// GET BRANCH BY ID
// ============================================
async function getBranchById(id) {
  console.log('\n🏢 [BRANCH SERVICE] Getting branch by ID...');
  console.log('🆔 Branch ID:', id);

  try {
    console.log('🔍 Fetching branch from database...');
    const branch = await prisma.branch.findUnique({
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

    if (!branch) {
      console.log('❌ Branch not found with ID:', id);
      throw new Error('Branch not found');
    }

    console.log('✅ Branch found:', branch.name);
    console.log('🎉 [BRANCH SERVICE] Get branch by ID completed\n');

    return branch;

  } catch (error) {
    console.log('❌ [BRANCH SERVICE] Get branch by ID failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error fetching branch: ${error.message}`);
  }
}

// ============================================
// CREATE BRANCH
// ============================================
async function createBranch(branchData, createdById) {
  console.log('\n➕ [BRANCH SERVICE] Creating new branch...');
  console.log('📦 Branch data:', branchData);
  console.log('👤 Created by:', createdById);

  try {
    const { name, code, address, phone, email, status, hours, branch_image, adminId } = branchData;

    // Step 1: Validate adminId is provided
    console.log('🔍 Step 1: Validating admin ID...');
    if (!adminId) {
      console.log('❌ Admin ID is required');
      throw new Error('adminId is required to create a branch');
    }
    console.log('✅ Admin ID provided:', adminId);

    // Step 2: Check if admin exists and is role 'admin' or 'superadmin'
    console.log('🔍 Step 2: Checking if admin exists...');
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
    });

    if (!admin) {
      console.log('❌ Admin user not found');
      throw new Error('Admin user not found');
    }

    console.log('✅ Admin found:', {
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    if (!['admin', 'superadmin'].includes(admin.role)) {
      console.log('❌ User is not an admin or superadmin');
      throw new Error('Assigned user must be an admin or superadmin');
    }

    console.log('✅ Admin role validated');

    // Step 3: Check if admin already has a branch (only for regular admins)
    console.log('🔍 Step 3: Checking admin branch assignment...');
    if (admin.role === 'admin' && admin.branchId) {
      console.log('❌ Admin already assigned to branch:', admin.branchId);
      throw new Error('Admin is already assigned to a branch');
    }
    console.log('✅ Admin can be assigned to new branch');

    // Step 4: Map status to enum
    console.log('🔍 Step 4: Mapping status to enum...');
    const statusEnum = status === 'Active' ? 'ACTIVE' 
      : status === 'Inactive' ? 'INACTIVE' 
      : status === 'Maintenance' ? 'MAINTENANCE' 
      : 'INACTIVE';
    console.log('✅ Status mapped:', statusEnum);

    // Step 5: Create branch and update admin's branchId in transaction
    console.log('🔍 Step 5: Creating branch in database...');
    const result = await prisma.$transaction(async (prisma) => {
      // Create branch
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

      console.log('✅ Branch created:', {
        id: branch.id,
        name: branch.name,
        code: branch.code
      });

      // Update admin's branchId (only for regular admins)
      if (admin.role === 'admin') {
        console.log('🔍 Updating admin branch assignment...');
        await prisma.user.update({
          where: { id: parseInt(adminId) },
          data: { branchId: branch.id },
        });
        console.log('✅ Admin branch assignment updated');
      }

      return branch;
    });

    console.log('✅ Branch creation transaction completed');
    console.log('🎉 [BRANCH SERVICE] Create branch completed\n');

    return result;

  } catch (error) {
    console.log('❌ [BRANCH SERVICE] Create branch failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error creating branch: ${error.message}`);
  }
}

// ============================================
// UPDATE BRANCH
// ============================================
async function updateBranch(id, branchData) {
  console.log('\n✏️ [BRANCH SERVICE] Updating branch...');
  console.log('🆔 Branch ID:', id);
  console.log('📦 Update data:', branchData);

  try {
    const { name, code, address, phone, email, status, hours, branch_image } = branchData;

    // Step 1: Check if branch exists
    console.log('🔍 Step 1: Checking if branch exists...');
    const existingBranch = await prisma.branch.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBranch) {
      console.log('❌ Branch not found with ID:', id);
      throw new Error('Branch not found');
    }
    console.log('✅ Branch found:', existingBranch.name);

    // Step 2: Map status to enum
    console.log('🔍 Step 2: Mapping status to enum...');
    const statusEnum = status === 'Active' ? 'ACTIVE' 
      : status === 'Inactive' ? 'INACTIVE' 
      : status === 'Maintenance' ? 'MAINTENANCE' 
      : 'INACTIVE';
    console.log('✅ Status mapped:', statusEnum);

    // Step 3: Prepare update data
    console.log('🔍 Step 3: Preparing update data...');
    const updateData = {
      name,
      code,
      address,
      phone,
      email,
      status: statusEnum,
      hours,
    };

    if (branch_image) {
      updateData.branch_image = branch_image;
    }

    console.log('✅ Update data prepared:', Object.keys(updateData));

    // Step 4: Update branch
    console.log('🔍 Step 4: Updating branch in database...');
    const updatedBranch = await prisma.branch.update({
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

    console.log('✅ Branch updated successfully');
    console.log('🎉 [BRANCH SERVICE] Update branch completed\n');

    return updatedBranch;

  } catch (error) {
    console.log('❌ [BRANCH SERVICE] Update branch failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error updating branch: ${error.message}`);
  }
}

// ============================================
// DELETE BRANCH
// ============================================
async function deleteBranch(id) {
  console.log('\n🗑️ [BRANCH SERVICE] Deleting branch...');
  console.log('🆔 Branch ID:', id);

  try {
    // Step 1: Check if branch exists
    console.log('🔍 Step 1: Checking if branch exists...');
    const existingBranch = await prisma.branch.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBranch) {
      console.log('❌ Branch not found with ID:', id);
      throw new Error('Branch not found');
    }
    console.log('✅ Branch found:', existingBranch.name);

    // Step 2: Check if branch has associated data
    console.log('🔍 Step 2: Checking for associated data...');
    const staffCount = await prisma.staff.count({
      where: { branchId: parseInt(id) },
    });

    const memberCount = await prisma.user.count({
      where: { branchId: parseInt(id), role: 'member' },
    });

    console.log(`📊 Associated data - Staff: ${staffCount}, Members: ${memberCount}`);

    if (staffCount > 0 || memberCount > 0) {
      console.log('⚠️  Branch has associated data, cannot delete');
      throw new Error('Cannot delete branch with associated staff or members');
    }

    console.log('✅ No associated data found');

    // Step 3: Delete branch
    console.log('🔍 Step 3: Deleting branch from database...');
    await prisma.branch.delete({
      where: { id: parseInt(id) },
    });

    console.log('✅ Branch deleted successfully');
    console.log('🎉 [BRANCH SERVICE] Delete branch completed\n');

  } catch (error) {
    console.log('❌ [BRANCH SERVICE] Delete branch failed:', error.message);
    console.log('📋 Error stack:', error.stack);
    throw new Error(`Error deleting branch: ${error.message}`);
  }
}

// Export all functions
module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
