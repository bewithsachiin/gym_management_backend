const express = require('express');
const router = express.Router();
const branchPlanController = require('../controllers/branchPlanController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

// Branch Plan CRUD routes
router.get('/', authenticateToken, accessControl(), branchPlanController.getBranchPlans);
router.get('/:id', authenticateToken, accessControl(), branchPlanController.getBranchPlan);
router.post('/', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), branchPlanController.createBranchPlan);
router.put('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), branchPlanController.updateBranchPlan);
router.delete('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), branchPlanController.deleteBranchPlan);

// Branch Plan status toggle
router.patch('/:id/toggle-status', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), branchPlanController.toggleBranchPlanStatus);

// Branch Booking request routes
router.get('/bookings/requests', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), branchPlanController.getBranchBookingRequests);
router.patch('/bookings/:id/approve', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), branchPlanController.approveBranchBooking);
router.patch('/bookings/:id/reject', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), branchPlanController.rejectBranchBooking);

module.exports = router;
