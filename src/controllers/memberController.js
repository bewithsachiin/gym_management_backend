// Member Controller - Simple functions with detailed logging
const memberService = require('../services/memberService');
const responseHandler = require('../utils/responseHandler');

// ============================================
// GET MEMBERS
// ============================================
async function getMembers(req, res, next) {
  console.log('\n🎯 [MEMBER CONTROLLER] Get members endpoint hit');

  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const filters = req.queryFilters;
    const { search } = req.query;

    console.log('👤 User role:', userRole);
    console.log('🏢 User branch:', userBranchId);
    console.log('🔍 Search term:', search);
    console.log('📋 Filters:', filters);

    let members;

    if (isSuperAdmin) {
      console.log('🔓 SuperAdmin access - fetching all members');
      members = await memberService.getAllMembers();
      console.log(`✅ Fetched ${members.length} members`);
    } else {
      console.log('🔒 Branch-restricted access - fetching branch members');
      members = await memberService.getMembersByBranch(userBranchId, search);
      console.log(`✅ Fetched ${members.length} members from branch ${userBranchId}`);
    }

    console.log('📤 Sending success response');
    responseHandler.success(res, 'Members fetched successfully', { members });

  } catch (error) {
    console.log('❌ [MEMBER CONTROLLER] Get members error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// CREATE MEMBER
// ============================================
async function createMember(req, res, next) {
  console.log('\n🎯 [MEMBER CONTROLLER] Create member endpoint hit');
  console.log('📦 Request body:', req.body);

  try {
    const memberData = req.body;

    // Add profile photo from file upload if exists
    if (req.file) {
      console.log('📸 Profile photo uploaded:', req.file.path);
      memberData.profile_photo = req.file.path;
    }

    // Ensure member is created in the admin's branch
    const { userRole, userBranchId } = req.accessFilters;
    console.log('👤 Creator role:', userRole);
    console.log('🏢 Creator branch:', userBranchId);

    if (userRole === 'admin' && !memberData.branchId) {
      console.log('🔧 Setting branch ID to admin branch:', userBranchId);
      memberData.branchId = userBranchId;
    }

    const createdById = req.user.id;
    const createdByRole = req.user.role;

    console.log('📞 Calling member service to create member...');
    const member = await memberService.createMember(memberData, createdById, createdByRole);

    console.log('✅ Member created successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Member created successfully', { member });

  } catch (error) {
    console.log('❌ [MEMBER CONTROLLER] Create member error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// UPDATE MEMBER
// ============================================
async function updateMember(req, res, next) {
  console.log('\n🎯 [MEMBER CONTROLLER] Update member endpoint hit');
  console.log('🆔 Member ID:', req.params.id);
  console.log('📦 Request body:', req.body);

  try {
    const { id } = req.params;
    const memberData = req.body;

    // Add profile photo from file upload if exists
    if (req.file) {
      console.log('📸 Profile photo uploaded:', req.file.path);
      memberData.profile_photo = req.file.path;
    }

    console.log('📞 Calling member service to update member...');
    const member = await memberService.updateMember(id, memberData);

    console.log('✅ Member updated successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Member updated successfully', { member });

  } catch (error) {
    console.log('❌ [MEMBER CONTROLLER] Update member error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// ============================================
// DELETE MEMBER
// ============================================
async function deleteMember(req, res, next) {
  console.log('\n🎯 [MEMBER CONTROLLER] Delete member endpoint hit');
  console.log('🆔 Member ID:', req.params.id);

  try {
    const { id } = req.params;

    console.log('📞 Calling member service to delete member...');
    await memberService.deleteMember(id);

    console.log('✅ Member deleted successfully');
    console.log('📤 Sending success response');
    responseHandler.success(res, 'Member deleted successfully');

  } catch (error) {
    console.log('❌ [MEMBER CONTROLLER] Delete member error:', error.message);
    console.log('📋 Error details:', error);
    next(error);
  }
}

// Export all functions
module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
};
