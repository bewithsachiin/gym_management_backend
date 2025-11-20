const express = require('express');
const router = express.Router();
const personalTrainingSessionController = require('../controllers/personalTrainingSessionController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { accessControl, checkPermission } = require('../middlewares/accessControl.middleware');

// Get all sessions with optional filters
router.get('/', authenticateToken, accessControl(), personalTrainingSessionController.getSessions);

// Get session by ID
router.get('/:id', authenticateToken, accessControl(), personalTrainingSessionController.getSessionById);

// Create new session
router.post('/', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin', 'personaltrainer']), personalTrainingSessionController.createSession);

// Update session
router.put('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin', 'personaltrainer']), personalTrainingSessionController.updateSession);

// Delete session
router.delete('/:id', authenticateToken, accessControl(), checkPermission(['superadmin', 'admin']), personalTrainingSessionController.deleteSession);

// Get trainers for session creation
router.get('/trainers/list', authenticateToken, accessControl(), personalTrainingSessionController.getTrainers);

// Get members for session creation
router.get('/members/list', authenticateToken, accessControl(), personalTrainingSessionController.getMembersForSessions);

module.exports = router;
