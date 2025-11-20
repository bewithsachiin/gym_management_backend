/**
 * Member Routes Module
 *
 * This module defines the API routes for member management.
 * It sets up the endpoints that the frontend can call to interact with member data.
 *
 * Routes:
 * - GET /api/members - Get all members (with search and branch filtering)
 * - POST /api/members - Create a new member
 * - PUT /api/members/:id - Update an existing member
 * - PUT /api/members/:id/activate - Toggle member activation status
 * - DELETE /api/members/:id - Delete a member
 *
 * Middleware:
 * - authenticateToken: Ensures user is logged in
 * - accessControl: Handles branch-based access restrictions
 * - checkPermission: Checks for specific role permissions
 * - memberUpload: Handles file uploads for member photos
 */

const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { memberUpload } = require('../middlewares/uploadMiddleware');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

// Get all members with optional search and branch filtering
router.get('/', authenticateToken, accessControl(), memberController.getMembers);

// Create a new member (requires superadmin or admin permissions)
router.post('/', authenticateToken, checkPermission(['superadmin', 'admin']), memberUpload, memberController.createMember);

// Update an existing member (requires access control and admin permissions)
router.put('/:id', authenticateToken, accessControl({ includeUserFilter: true }), checkPermission(['superadmin', 'admin']), memberUpload, memberController.updateMember);

// Toggle member activation status (Activate/Activated)
router.put('/:id/activate', authenticateToken, accessControl({ includeUserFilter: true }), memberController.activateMember);

// Delete a member (requires access control and admin permissions)
router.delete('/:id', authenticateToken, accessControl({ includeUserFilter: true }), checkPermission(['superadmin', 'admin']), memberController.deleteMember);

module.exports = router;
