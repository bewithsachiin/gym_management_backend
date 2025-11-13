const memberService = require('../services/memberService');
const responseHandler = require('../utils/responseHandler');

const getMembers = async (req, res, next) => {
  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const filters = req.queryFilters;
    const { search } = req.query; // Get search term from query params

    console.log(`👤 Member Controller - Get members - Role: ${userRole}, Branch: ${userBranchId}, Filters:`, filters, 'Search:', search);

    let members;
    if (isSuperAdmin) {
      members = await memberService.getAllMembers();
      console.log(`👤 SuperAdmin fetched all members - Count: ${members.length}`);
    } else {
      // Other roles see members from their branch
      members = await memberService.getMembersByBranch(userBranchId, search);
      console.log(`👤 User fetched branch members - Count: ${members.length}`);
    }

    responseHandler.success(res, 'Members fetched successfully', { members });
  } catch (error) {
    console.error('❌ Member Controller Error:', error);
    next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    const memberData = req.body;
    if (req.file) {
      memberData.profile_photo = req.file.path; // Cloudinary URL from middleware
    }

    // Ensure member is created in the admin's branch
    const { userRole, userBranchId } = req.accessFilters;
    if (userRole === 'admin' && !memberData.branchId) {
      memberData.branchId = userBranchId;
    }

    const createdById = req.user.id; // Get creator ID from authenticated user
    const createdByRole = req.user.role; // Get creator role from authenticated user
    const member = await memberService.createMember(memberData, createdById, createdByRole);
    responseHandler.success(res, 'Member created successfully', { member });
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memberData = req.body;
    if (req.file) {
      memberData.profile_photo = req.file.path; // Cloudinary URL from middleware
    }
    const member = await memberService.updateMember(id, memberData);
    responseHandler.success(res, 'Member updated successfully', { member });
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    await memberService.deleteMember(id);
    responseHandler.success(res, 'Member deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
};
