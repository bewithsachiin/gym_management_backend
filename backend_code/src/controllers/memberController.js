/**
 * Member Controller Module
 *
 * This module handles HTTP requests related to gym members.
 * It acts as the interface between the API routes and the member service layer.
 * Each function corresponds to a specific API endpoint and handles request/response logic.
 *
 * Key Features:
 * - Authentication and authorization checks
 * - Input validation and error handling
 * - Response formatting using responseHandler utility
 * - Branch-based access control for multi-branch support
 */

const memberService = require('../services/memberService');
const responseHandler = require('../utils/responseHandler');

/**
 * Get all members with optional filtering
 * GET /api/members
 * Query params: search, branchId
 */
const getMembers = async (req, res, next) => {
  try {
    // Extract access control information from middleware
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const filters = req.queryFilters;
    const { search, branchId } = req.query; // Get search term and branch filter from query params

    console.log(`👤 Member Controller - Get members - Role: ${userRole}, Branch: ${userBranchId}, Filters:`, filters, 'Search:', search, 'Branch Filter:', branchId);

    let members;
    if (isSuperAdmin) {
      // SuperAdmin can filter by branch or see all
      const filterBranchId = branchId ? parseInt(branchId) : null;
      members = await memberService.getMembers(filterBranchId, search);
      console.log(`👤 SuperAdmin fetched members - Count: ${members.length}, Branch Filter: ${filterBranchId || 'All'}`);
    } else {
      // Other roles see members from their branch only
      members = await memberService.getMembers(userBranchId, search);
      console.log(`👤 User fetched branch members - Count: ${members.length}`);
    }

    responseHandler.success(res, 'Members fetched successfully', { members });
  } catch (error) {
    console.error('❌ Member Controller Error:', error);
    next(error);
  }
};

/**
 * Create a new member
 * POST /api/members
 * Requires: superadmin or admin permissions
 */
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

/**
 * Update an existing member
 * PUT /api/members/:id
 * Requires: access control permissions (includeUserFilter: true)
 */
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

/**
 * Toggle member activation status (Activate/Activated)
 * PUT /api/members/:id/activate
 * Requires: access control permissions (includeUserFilter: true)
 */
const activateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await memberService.activateMember(id);
    responseHandler.success(res, 'Member activation status updated successfully', { member });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a member
 * DELETE /api/members/:id
 * Requires: access control permissions (includeUserFilter: true) and superadmin/admin permissions
 */
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
  activateMember,
  deleteMember,
};
