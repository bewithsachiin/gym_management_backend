// Staff Controller - Simple functions with detailed logging
const staffService = require('../services/staffService');
const responseHandler = require('../utils/responseHandler');

// ============================================
// GET STAFF
// ============================================
async function getStaff(req, res, next) {
  console.log('\n🎯 [STAFF CONTROLLER] Get staff endpoint hit');

  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const filters = req.queryFilters;

    console.log('👤 User role:', userRole);
    console.log('🏢 User branch:', userBranchId);
    console.log('📋 Filters:', filters);

    let staff;

    if (isSuperAdmin) {
      console.log('🔓 SuperAdmin access - fetching all staff');
      staff = await staffService.getAllStaff();
      console.log(`✅ Fetched ${staff.length} staff members`);
    } else {
      console.log('🔒 Branch-restricted access - fetching branch staff');
      staff = await staffService.getStaffByBranch(userBranchId);
      console.log(`✅ Fetched ${staff.length} staff members from branch ${userBranchId}`);
    }

    console.log('📤 Sending success response');
    responseHandler.success(res, 'Staff fetched successfully', { staff });

  } catch (error) {
    console.log('❌ [STAFF CONTROLLER] Get staff error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// CREATE STAFF
// ============================================
async function createStaff(req, res, next) {
  console.log('\n🎯 [STAFF CONTROLLER] Create staff endpoint hit');
  console.log('📦 Request body:', req.body);

  try {
    const staffData = req.body;

    // Add profile photo from file upload if exists
    if (req.file) {
      console.log('📸 Profile photo uploaded:', req.file.path);
      staffData.profile_photo = req.file.path;
    }

    // Ensure staff is created in the admin's branch
    const { userRole, userBranchId } = req.accessFilters;
    console.log('👤 Creator role:', userRole);
    console.log('🏢 Creator branch:', userBranchId);

    if (userRole === 'admin' && !staffData.branchId) {
      console.log('🔧 Setting branch ID to admin branch:', userBranchId);
      staffData.branchId = userBranchId;
    }

    const createdById = req.user.id;
    console.log('👤 Created by user ID:', createdById);

    console.log('📞 Calling staff service to create staff...');
    const staff = await staffService.createStaff(staffData, createdById);

    console.log('✅ Staff created successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Staff created successfully', { staff });

  } catch (error) {
    console.log('❌ [STAFF CONTROLLER] Create staff error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// UPDATE STAFF
// ============================================
async function updateStaff(req, res, next) {
  console.log('\n🎯 [STAFF CONTROLLER] Update staff endpoint hit');
  console.log('🆔 Staff ID:', req.params.id);
  console.log('📦 Request body:', req.body);

  try {
    const { id } = req.params;
    const staffData = req.body;

    // Add profile photo from file upload if exists
    if (req.file) {
      console.log('📸 Profile photo uploaded:', req.file.path);
      staffData.profile_photo = req.file.path;
    }

    console.log('📞 Calling staff service to update staff...');
    const staff = await staffService.updateStaff(id, staffData);

    console.log('✅ Staff updated successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Staff updated successfully', { staff });

  } catch (error) {
    console.log('❌ [STAFF CONTROLLER] Update staff error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// DELETE STAFF
// ============================================
async function deleteStaff(req, res, next) {
  console.log('\n🎯 [STAFF CONTROLLER] Delete staff endpoint hit');
  console.log('🆔 Staff ID:', req.params.id);

  try {
    const { id } = req.params;

    console.log('📞 Calling staff service to delete staff...');
    await staffService.deleteStaff(id);

    console.log('✅ Staff deleted successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Staff deleted successfully');

  } catch (error) {
    console.log('❌ [STAFF CONTROLLER] Delete staff error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// Export all functions
module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
