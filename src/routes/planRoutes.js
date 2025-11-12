const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Plan CRUD routes
router.get('/', authenticateToken, planController.getPlans);
router.get('/:id', authenticateToken, planController.getPlan);
router.post('/', authenticateToken, authorizeRoles('superadmin', 'admin'), planController.createPlan);
router.put('/:id', authenticateToken, authorizeRoles('superadmin', 'admin'), planController.updatePlan);
router.delete('/:id', authenticateToken, authorizeRoles('superadmin', 'admin'), planController.deletePlan);

// Plan status toggle
router.patch('/:id/toggle-status', authenticateToken, authorizeRoles('superadmin', 'admin'), planController.togglePlanStatus);

// Booking request routes
router.get('/bookings/requests', authenticateToken, authorizeRoles('superadmin', 'admin'), planController.getBookingRequests);
router.post('/bookings/request', authenticateToken, authorizeRoles('member'), planController.createBookingRequest);
router.patch('/bookings/:id/approve', authenticateToken, authorizeRoles('superadmin', 'admin'), planController.approveBooking);
router.patch('/bookings/:id/reject', authenticateToken, authorizeRoles('superadmin', 'admin'), planController.rejectBooking);

module.exports = router;
