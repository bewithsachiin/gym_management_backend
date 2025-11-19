// Branch Controller - Simple functions with detailed logging
const branchService = require('../services/branchService');
const responseHandler = require('../utils/responseHandler');

// ============================================
// GET BRANCHES
// ============================================
async function getBranches(req, res, next) {
  console.log('\n🎯 [BRANCH CONTROLLER] Get branches endpoint hit');

  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const filters = req.queryFilters;

    console.log('👤 User role:', userRole);
    console.log('🏢 User branch:', userBranchId);
    console.log('📋 Filters:', filters);

    let branches;

    if (isSuperAdmin) {
      console.log('🔓 SuperAdmin access - fetching all branches');
      branches = await branchService.getAllBranches();
      console.log(`✅ Fetched ${branches.length} branches`);
    } else {
      console.log('🔒 Branch-restricted access - fetching user branch');
      const branch = await branchService.getBranchById(userBranchId);
      branches = branch ? [branch] : [];
      console.log(`✅ Fetched ${branches.length} branch(es)`);
    }

    console.log('📤 Sending success response');
    responseHandler.success(res, 'Branches fetched successfully', { branches });

  } catch (error) {
    console.log('❌ [BRANCH CONTROLLER] Get branches error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// CREATE BRANCH
// ============================================
async function createBranch(req, res, next) {
  console.log('\n🎯 [BRANCH CONTROLLER] Create branch endpoint hit');
  console.log('📦 Request body:', req.body);

  try {
    const branchData = req.body;

    // Add branch image from file upload if exists
    if (req.file) {
      console.log('📸 Branch image uploaded:', req.file.path);
      branchData.branch_image = req.file.path;
    }

    // If superadmin and no adminId provided, link superadmin id
    if (req.user.role === 'superadmin' && !branchData.adminId) {
      console.log('🔧 Setting admin ID to superadmin:', req.user.id);
      branchData.adminId = req.user.id;
    }

    console.log('📞 Calling branch service to create branch...');
    const branch = await branchService.createBranch(branchData, req.user.id);

    console.log('✅ Branch created successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Branch created successfully', { branch });

  } catch (error) {
    console.log('❌ [BRANCH CONTROLLER] Create branch error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// UPDATE BRANCH
// ============================================
async function updateBranch(req, res, next) {
  console.log('\n🎯 [BRANCH CONTROLLER] Update branch endpoint hit');
  console.log('🆔 Branch ID:', req.params.id);
  console.log('📦 Request body:', req.body);

  try {
    const { id } = req.params;
    const branchData = req.body;

    // Add branch image from file upload if exists
    if (req.file) {
      console.log('📸 Branch image uploaded:', req.file.path);
      branchData.branch_image = req.file.path;
    }

    console.log('📞 Calling branch service to update branch...');
    const branch = await branchService.updateBranch(id, branchData);

    console.log('✅ Branch updated successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Branch updated successfully', { branch });

  } catch (error) {
    console.log('❌ [BRANCH CONTROLLER] Update branch error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// DELETE BRANCH
// ============================================
async function deleteBranch(req, res, next) {
  console.log('\n🎯 [BRANCH CONTROLLER] Delete branch endpoint hit');
  console.log('🆔 Branch ID:', req.params.id);

  try {
    const { id } = req.params;

    console.log('📞 Calling branch service to delete branch...');
    await branchService.deleteBranch(id);

    console.log('✅ Branch deleted successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Branch deleted successfully');

  } catch (error) {
    console.log('❌ [BRANCH CONTROLLER] Delete branch error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// Export all functions
module.exports = {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
