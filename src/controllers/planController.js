const planService = require('../services/planService');
const responseHandler = require('../utils/responseHandler');

// Get all plans
const getPlans = async (req, res, next) => {
  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const filters = { ...req.query, ...req.queryFilters };

    console.log(`📋 Plan Controller - Get plans - Role: ${userRole}, Branch: ${userBranchId}, Filters:`, filters);

    const plans = await planService.getAllPlans(filters);
    console.log(`📋 Plans fetched - Count: ${plans.length}`);

    responseHandler.success(res, 'Plans fetched successfully', { plans });
  } catch (error) {
    console.error('❌ Plan Controller Error:', error);
    next(error);
  }
};

// Get features
const getFeatures = async (req, res, next) => {
  try {
    const features = await planService.getFeatures();
    responseHandler.success(res, 'Features fetched successfully', { features });
  } catch (error) {
    console.error('❌ Plan Controller Error:', error);
    next(error);
  }
};

// Get plan by ID
const getPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { branchId, role } = req.user;

    // Enforce branch isolation unless superadmin
    const branchFilter = role !== 'superadmin' ? branchId : null;

    const plan = await planService.getPlanById(id, branchFilter);
    if (!plan) {
      return responseHandler.error(res, 'Plan not found', 404);
    }

    responseHandler.success(res, 'Plan fetched successfully', { plan });
  } catch (error) {
    next(error);
  }
};

// Create new plan
const createPlan = async (req, res, next) => {
  try {
    const planData = req.body;
    const { id: userId, branchId, role } = req.user;

    // Set branchId for non-superadmin users
    if (role !== 'superadmin') {
      planData.branchId = branchId;
    }

    // For admin, ensure plan is created in their branch
    const { userRole, userBranchId } = req.accessFilters;
    if (userRole === 'admin' && !planData.branchId) {
      planData.branchId = userBranchId;
    }

    const plan = await planService.createPlan(planData, userId);
    responseHandler.success(res, 'Plan created successfully', { plan }, 201);
  } catch (error) {
    next(error);
  }
};

// Update plan
const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const planData = req.body;
    const { id: userId, branchId, role } = req.user;

    // Enforce branch isolation unless superadmin
    const branchFilter = role !== 'superadmin' ? branchId : null;

    const plan = await planService.updatePlan(id, planData, userId, branchFilter);
    responseHandler.success(res, 'Plan updated successfully', { plan });
  } catch (error) {
    next(error);
  }
};

// Delete plan
const deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, branchId, role } = req.user;

    // Enforce branch isolation unless superadmin
    const branchFilter = role !== 'superadmin' ? branchId : null;

    await planService.deletePlan(id, userId, branchFilter);
    responseHandler.success(res, 'Plan deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Toggle plan status
const togglePlanStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, branchId, role } = req.user;

    // Enforce branch isolation unless superadmin
    const branchFilter = role !== 'superadmin' ? branchId : null;

    const plan = await planService.togglePlanStatus(id, userId, branchFilter);
    responseHandler.success(res, 'Plan status updated successfully', { plan });
  } catch (error) {
    next(error);
  }
};

// Get booking requests
const getBookingRequests = async (req, res, next) => {
  try {
    const { branchId, role } = req.user;
    const filters = { ...req.query };

    // Enforce branch isolation unless superadmin
    if (role !== 'superadmin') {
      filters.branchId = branchId;
    }

    const bookings = await planService.getBookingRequests(filters);
    responseHandler.success(res, 'Booking requests fetched successfully', { bookings });
  } catch (error) {
    next(error);
  }
};

// Create booking request (for members)
const createBookingRequest = async (req, res, next) => {
  try {
    const bookingData = req.body;
    const { id: userId } = req.user;

    const booking = await planService.createBookingRequest(bookingData, userId);
    responseHandler.success(res, 'Booking request submitted successfully', { booking }, 201);
  } catch (error) {
    next(error);
  }
};

// Approve booking request
const approveBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, branchId, role } = req.user;

    // Only admins can approve bookings
    if (!['superadmin', 'admin'].includes(role)) {
      return responseHandler.error(res, 'Insufficient permissions', 403);
    }

    const booking = await planService.approveBooking(id, userId);
    responseHandler.success(res, 'Booking approved successfully', { booking });
  } catch (error) {
    next(error);
  }
};

// Reject booking request
const rejectBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, branchId, role } = req.user;

    // Only admins can reject bookings
    if (!['superadmin', 'admin'].includes(role)) {
      return responseHandler.error(res, 'Insufficient permissions', 403);
    }

    const booking = await planService.rejectBooking(id, userId);
    responseHandler.success(res, 'Booking rejected successfully', { booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlans,
  getFeatures,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  getBookingRequests,
  createBookingRequest,
  approveBooking,
  rejectBooking,
};
